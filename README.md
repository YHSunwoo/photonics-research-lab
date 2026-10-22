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

## 게시물별 편집과 문서 편집기

관리자로 로그인한 브라우저 탭에서 홈페이지를 열면 뉴스, 멤버, 논문, 특허, 연구 소개와 배너에 수정 버튼이 표시됩니다. 각 버튼은 해당 항목의 관리자 편집 화면으로 연결됩니다. 일반 방문자에게는 버튼이 표시되지 않으며 서버의 기존 관리자 권한 검사도 그대로 적용됩니다.

뉴스와 People & Life 본문은 문서 편집기를 사용합니다. 나머지 정보는 구조화된 입력란과 추가 설명 편집기를 함께 제공합니다. 사진 업로드는 기존 lab-media 저장소를 사용하고, 글꼴·크기·정렬·표·링크·미리보기를 지원합니다. Save draft 후 Publish changes를 눌러 공개합니다.

편집기 의존성 버전은 package.json과 pnpm-lock.yaml에 고정되어 있습니다. npm 패키지 설치 후 `pnpm build:editors`로 공개 JavaScript 번들을 갱신합니다. 편집 HTML은 저장 시와 공개 표시 시 모두 허용된 태그·속성·스타일만 유지합니다.
