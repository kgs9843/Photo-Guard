# UI 스크린샷 (Playwright MCP)

로컬 개발 서버(`npm run dev:5231`, `http://127.0.0.1:5231`)에서 **Playwright MCP**로 캡처한 화면입니다.  
갱신일: 2026-04-25

## GitHub에서 이미지가 깨질 때

PR·`README`·문서에서 이미지를 넣을 때는 아래를 권장합니다.

1. **마크다운 이미지 문법** 사용: `![설명](URL)` (URL을 백틱으로 감싸면 코드 블록이 되어 이미지가 안 뜹니다.)
2. **원시(raw) URL** 사용: `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/docs/references/screenshot/<파일>.png`

이 레포 기본값(머지 후 `main` 기준):

```text
https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/<파일명>
```

브랜치가 아직 머지 전이면 `<branch>`를 해당 브랜치 이름으로 바꿉니다.

## 화면별 파일

| 순서 | 라우트               | 파일                    | 비고                                             |
| ---- | -------------------- | ----------------------- | ------------------------------------------------ |
| 1    | `/` (홈·대시보드)    | `01-dashboard.png`      | AppShell 하단 탭 포함                            |
| 2    | `/clean`             | `02-clean.png`          | 선택 없이 진입 시 빈 상태                        |
| 3    | `/cleaning`          | `03-cleaning.png`       | 상태 없이 진입 시 표시                           |
| 4    | `/history`           | `04-history.png`        | 기록 목록                                        |
| 5    | `/history/:recordId` | `05-history-detail.png` | 예: 존재하지 않는 ID → “기록을 찾을 수 없습니다” |
| 6    | `/settings`          | `06-settings.png`       | 설정                                             |
| 7    | `/privacy`           | `07-privacy.png`        | 이용약관 및 개인정보 처리방침                    |
| 8    | `/licenses`          | `08-licenses.png`       | 오픈소스 라이선스                                |

## 미리보기 (main 브랜치 기준 raw URL)

홈(대시보드):

![홈 대시보드](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/01-dashboard.png)

Clean:

![Clean](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/02-clean.png)

Cleaning:

![Cleaning](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/03-cleaning.png)

기록:

![기록](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/04-history.png)

기록 상세(샘플):

![기록 상세](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/05-history-detail.png)

설정:

![설정](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/06-settings.png)

개인정보·약관:

![개인정보 및 약관](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/07-privacy.png)

라이선스:

![오픈소스 라이선스](https://raw.githubusercontent.com/kgs9843/Photo-Guard/main/docs/references/screenshot/08-licenses.png)
