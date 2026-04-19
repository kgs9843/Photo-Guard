# Workflows

- **[pull-request-template.md](./pull-request-template.md)** — PR 본문 **형식(SoT)**. 이 파일을 복사해 내용을 채운 뒤 PR을 엽니다.
- **[code-review.md](./code-review.md)** — 로컬에서 할 수 있는 검증 vs 사람·AI 리뷰

## PR 열기 (푸시 + `gh pr create`)

**권장(Windows PowerShell 포함):** 저장소 루트에서

```bash
npm run pr:open
```

기본 동작: **`npm run verify` 통과 후** `git push -u origin <현재 브랜치>` → `gh pr create`(본문은 SoT 템플릿 또는 아래 인자). 검증 생략: `npm run pr:open -- --skip-verify`.

| 예시                                                | 설명                                    |
| --------------------------------------------------- | --------------------------------------- |
| `npm run pr:open -- pr-body.local.md`               | 현재 브랜치 + 루트의 채운 본문          |
| `npm run pr:open -- exec-plan/foo pr-body.local.md` | 브랜치 + 본문 파일(루트 기준 상대 경로) |

Git Bash에서 **`bash scripts/pr-open.sh`** 는 내부적으로 위와 동일한 Node 스크립트를 호출합니다.

1. 위 템플릿과 동일한 섹션 구조로 본문을 작성합니다.
2. 저장소 루트에 예: **`pr-body.local.md`**로 두면 `.gitignore`에 있어 커밋되지 않습니다.
3. 인자를 생략하면 SoT 템플릿 **원문**이 PR 본문으로 올라갑니다(빈 칸 그대로).

4. **기록:** 채운 본문을 넘긴 경우, 성공 후 같은 내용이 [`pr-bodies/`](./pr-bodies/)에 YAML 머리말과 함께 저장됩니다. 원격에 남기려면 해당 파일을 커밋합니다. 템플릿만 썼을 때도 남기려면 `PR_BODY_ARCHIVE=1`.
