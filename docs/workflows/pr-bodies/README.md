# PR 본문 아카이브

`npm run pr:open` / `scripts/pr-open`이 PR을 연 뒤, **채운 본문 파일**을 두 번째 인자로 넘긴 경우 이 디렉터리에 **기록용 복사본**을 남깁니다.

- 파일명: `UTC타임스탬프-브랜치슬러그.md` (브랜치의 `/`는 `-`로 치환)
- 상단 YAML: `branch`, `body_source`(레포 기준 경로), `archived_at`, 가능하면 `pr_url`
- 아래 본문: PR에 실제로 넣은 마크다운과 동일

SoT 템플릿만 넘기고도 남기려면 `PR_BODY_ARCHIVE=1 bash scripts/pr-open.sh …` 를 사용합니다.

**운영:** 기록을 원격에 남기려면 생성된 `.md`를 **커밋**합니다(자동 커밋은 하지 않음).
