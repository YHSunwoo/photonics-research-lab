begin;

create table public.lab_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.lab_admins enable row level security;
revoke all on public.lab_admins from anon, authenticated;

create function public.is_lab_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.lab_admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_lab_admin() from public, anon;
grant execute on function public.is_lab_admin() to authenticated;

create table public.lab_document (
  id text primary key check (id = 'main'),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.lab_document enable row level security;
revoke all on public.lab_document from anon, authenticated;
grant select (id,content,revision,updated_at) on public.lab_document to anon, authenticated;
create policy "Read published website" on public.lab_document for select to anon, authenticated using (id = 'main');

create table public.lab_revisions (
  revision bigint primary key,
  content jsonb not null,
  saved_at timestamptz not null default now(),
  saved_by uuid references auth.users(id) on delete set null
);
alter table public.lab_revisions enable row level security;
revoke all on public.lab_revisions from anon, authenticated;
grant select on public.lab_revisions to authenticated;
create policy "Admins read revision history" on public.lab_revisions for select to authenticated using ((select public.is_lab_admin()));

create function public.publish_lab_content(p_content jsonb, p_expected_revision bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare current_record public.lab_document; next_revision bigint; category text;
begin
  if not public.is_lab_admin() then raise exception 'Administrator access required' using errcode = '42501'; end if;
  if p_content is null or jsonb_typeof(p_content) <> 'object' or octet_length(p_content::text) > 8000000 then
    raise exception 'Invalid website content';
  end if;
  foreach category in array array['phd','ms','undergrad','alumni','journals','domesticJournals','internationalConferences','domesticConferences','registeredPatents','pendingPatents','news','gallery','research','banners'] loop
    if jsonb_typeof(p_content->category) is distinct from 'array' then raise exception 'Missing content section: %',category; end if;
  end loop;
  if jsonb_array_length(p_content->'banners') = 0 or jsonb_typeof(p_content->'professor') is distinct from 'object' then
    raise exception 'A home banner and professor profile are required';
  end if;
  -- Serialize initial creation and all later publishes, including expected revision 0.
  perform pg_advisory_xact_lock(716340219);
  select * into current_record from public.lab_document where id='main' for update;
  if coalesce(current_record.revision,0) <> p_expected_revision then
    raise exception 'Content was changed by another administrator. Reload before publishing.' using errcode = '40001';
  end if;
  next_revision := coalesce(current_record.revision,0)+1;
  if current_record.id is not null then
    insert into public.lab_revisions(revision,content,saved_by) values(current_record.revision,current_record.content,current_record.updated_by);
  end if;
  insert into public.lab_document(id,content,revision,updated_by) values('main',p_content,next_revision,auth.uid())
  on conflict(id) do update set content=excluded.content,revision=excluded.revision,updated_at=now(),updated_by=excluded.updated_by;
  return next_revision;
end; $$;
revoke all on function public.publish_lab_content(jsonb,bigint) from public, anon;
grant execute on function public.publish_lab_content(jsonb,bigint) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('lab-media','lab-media',true,5242880,array['image/jpeg','image/png','image/webp','image/gif']);
create policy "Admins upload lab photos" on storage.objects for insert to authenticated
with check (bucket_id='lab-media' and (select public.is_lab_admin()));
create policy "Admins list lab photos" on storage.objects for select to authenticated
using (bucket_id='lab-media' and (select public.is_lab_admin()));
-- No public upload, overwrite, deletion, admin self-enrollment or client-side role grants.

commit;
