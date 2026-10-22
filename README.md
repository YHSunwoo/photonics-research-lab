# Photonics Research Lab

Kwangwoon University laboratory website. Public visitors do not need accounts. Only pre-approved administrators can sign in and publish edits.

- Website source: `docs/` (GitHub Pages, branch `main`, folder `/docs`)
- Admin: `admin.html` on the published website
- Authentication, live content, photos and revision history: Supabase
- Initial snapshot and original photos: included in `docs/`

## Current deployment

GitHub Pages can serve the existing website immediately. The administrator system needs a Supabase project configured before login or online publishing can be used. Until configured, the site uses `docs/data.json` and the admin screen clearly reports that setup is incomplete.

## Setup

Follow [SETUP.md](SETUP.md). Only a public project URL and **publishable** key belong in `docs/site-config.js`. Never commit database passwords, access tokens, secret keys or `service_role` keys.

## Editing

After setup, open Admin login in the footer. Sign in using the account created by the project owner. Edit a record, save it to the working draft, then use **Publish changes** to publish the accumulated changes. Publishing uses a revision check so another administrator's update cannot be silently overwritten. Previous published versions are retained in the database for administrators.

## Rights

Laboratory content and photographs remain the property of their respective owners. No blanket open-source or photo-reuse license is granted by this repository.
