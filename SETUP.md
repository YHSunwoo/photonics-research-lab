# 관리자 기능 연결

현재 디자인은 `docs/`에 들어 있습니다. 일반 방문자 계정이나 회원가입은 없습니다.

## 1. GitHub Pages

저장소 Settings → Pages → Deploy from a branch → `main` / `/docs` → Save.

예상 주소: `https://wkqcnpqkq.github.io/photonics-research-lab/`
이 주소는 Pages 배포 성공을 확인한 뒤 사용합니다.

## 2. Supabase (프로젝트 소유자 최초 설정)

1. 본인 소유 Supabase 프로젝트를 준비합니다. 유료 플랜이나 결제는 필요에 따라 본인이 선택하며 자동으로 신청하지 않습니다.
2. SQL Editor에서 `supabase/migrations/202610220001_admin_content.sql`을 실행합니다. 새 전용 프로젝트에 한 번 적용하는 마이그레이션입니다.
3. Authentication 설정에서 **Allow new users to sign up**을 끄고, 이메일 로그인을 켭니다. 일반 가입을 허용하지 않습니다.
4. Authentication → Users에서 관리자 `yhsunwoo@kw.ac.kr`을 생성합니다. 비밀번호는 본인이 직접 설정하며 코드나 채팅에 기록하지 않습니다.
5. Users에서 관리자 UUID를 확인한 뒤 SQL Editor에서 아래 문장을 실행합니다. UUID는 실제 관리자 값으로 바꿉니다.

```sql
insert into public.lab_admins(user_id) values ('관리자-UUID');
```

6. `docs/site-config.js`에 프로젝트 URL과 **publishable key**를 입력합니다. 이 둘은 브라우저에서 사용하는 공개 설정입니다. **secret/service_role/database password는 절대 입력하지 않습니다.**
7. 사이트의 `admin.html`에 로그인한 후 기존 자료를 확인하고 **Publish changes**를 한 번 눌러 초기 데이터를 데이터베이스에 게시합니다. 이후에는 웹에서 바로 편집합니다.

데이터베이스 연결 전에는 정적 스냅샷으로 홈페이지를 제공합니다. 연결을 활성화한 뒤 데이터 조회가 실패하면 홈페이지에는 보관된 스냅샷을 표시합니다.

## 3. 관리 방법

- 왼쪽에서 뉴스, 구성원, 논문, 학회, 특허, 연구 분야, 배너를 선택합니다.
- 항목을 선택해 입력란을 수정합니다. **Save draft**는 현재 화면의 작업본에 반영합니다.
- 사진을 업로드하거나 기존 사진 경로를 입력할 수 있습니다. 사진 파일은 최대 5MB입니다.
- **Publish changes**를 누르면 작업본 전체가 실제 홈페이지에 반영됩니다.
- 같은 시점에 다른 관리자가 게시했으면 덮어쓰지 않고 재확인을 요청합니다.
- 삭제는 작업본에서 항목을 제거하는 방식이며, 게시 전에는 새로고침으로 취소할 수 있습니다. 이전 게시본은 관리자 전용 이력 테이블에 보관됩니다.
- **Download backup**으로 현재 데이터를 보관할 수 있습니다.
- 게시하지 않은 작업본은 브라우저를 닫거나 새로고침하면 사라집니다.

## 보안 구조

로그인 화면을 숨기는 것에 의존하지 않습니다. 데이터베이스 함수가 관리자 UUID를 검사하고, RLS는 일반 사용자의 쓰기를 막습니다. 사진 업로드도 관리자 정책을 적용합니다. 공개 데이터에는 로그인 세션·사용자 비밀번호·관리자 명단을 넣지 않습니다.
