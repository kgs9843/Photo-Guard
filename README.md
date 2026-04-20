# Photo Guard

개인용 웹앱입니다. 사진을 고르고 EXIF 성격의 메타데이터를 확인한 뒤, 브라우저 안에서 다시 인코딩해 메타데이터를 제거합니다. 공유하기 전에 위치, 촬영 시각, 기기 단서가 파일과 함께 나가지 않게 하려는 용도입니다. 처리는 모두 클라이언트에서 이루어지며, 원본을 서버로 올리지 않습니다.

## 기능

- **홈(대시보드)**: 이미지 선택 (한 번에 최대 10장)
- **Clean**: 메타데이터 요약 확인 후 정제 단계로 이동
- **Cleaning**: 진행 UI, 완료 후 정제본 다운로드 또는 공유
- **기록**: 성공한 정제 결과를 IndexedDB에 저장하고, 썸네일과 제거 요약으로 목록·상세 확인
- **설정**: 내보내기 형식(JPEG / PNG), 로컬 기록 삭제

---

## 정제 방식

`createImageBitmap`으로 디코딩한 뒤 캔버스에 그리고, `toBlob`으로 JPEG 또는 PNG로 내보냅니다(JPEG는 품질 **0.98**). 비트맵을 새로 만들기 때문에 원본에 붙어 있던 임베드 메타데이터는 결과물에 대체로 넘어가지 않습니다. 특정 EXIF 태그만 골라 지우는 방식이 아니라, 강한(재인코딩 기반) 제거에 가깝습니다.

## 데이터 저장 위치

| 데이터                    | 저장소                                                  | 비고                           |
| ------------------------- | ------------------------------------------------------- | ------------------------------ |
| 기록 항목(blob + 요약 등) | **IndexedDB** `photo-guard-v1`, 스토어 `cleanedHistory` | 자동 만료 없음. 설정에서 삭제. |
| 내보내기 형식 설정        | **localStorage** `photo-guard:export-format`            | 기록 삭제 후에도 유지.         |

---

## 기술 스택

- React 19, TypeScript, Vite 7, React Router
- Tailwind CSS 4
- exifr(메타데이터 읽기), lucide-react(아이콘)
- ESLint, Prettier, Husky, lint-staged

---

## 스크립트

```bash
npm install
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 미리보기
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run verify       # 린트·포맷·타입·빌드·FSD (PR 전 권장)
```

---

## 소스 구조

```
src/
├── app/       # shell (AppShell, TopBar), providers
├── pages/     # dashboard, clean, cleaning, history, settings, privacy, licenses, offline
├── shared/    # shared UI
├── App.tsx
└── main.tsx
```

슬라이스마다 `ui`와 `model` 폴더를 두는 등 Feature-Sliced Design에 가깝게 구성했습니다.

---

## Cursor / AI 에이전트로 작업하기

이 레포는 **사람이 의도와 완료 조건을 정하고**, **에이전트가 구현·검증 루프를 돕는** 흐름을 전제로 합니다. 상세 지도는 **[`AGENTS.md`](AGENTS.md)** 에 있습니다.

### 설계를 한눈에 (왜 이렇게 나뉘었나)

| 층                                          | 역할                                                                                                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **`.cursor/rules/project-constraints.mdc`** | 항상 적용: 한국어 응답, ESLint, `@theme`, try-catch 등. PR 직전에는 `gstack-review`(설치된 경우)와 교훈 로그도 여기서 이어집니다.               |
| **`AGENTS.md`**                             | 사용자가 **`@AGENTS.md` / 에이전트 지침**으로 **명시했을 때** 워크트리·`verify`·PR·순차 게이트를 따릅니다. 레포 전체 워크플로의 **지도**입니다. |
| **`docs/exec-plans/active/exec-plan-*.md`** | 작업 단위 **실행 계획(SoT)**. 채워 둔 목표·단계·완료 기준이 채팅보다 우선합니다.                                                                |
| **`npm run verify`**                        | CI와 맞는 **기계적 검증**(린트·포맷·타입·빌드·FSD). 사람 리뷰 전에 깨지면 안 되는 층입니다.                                                     |
| **gstack `gstack-review`** (선택)           | 사용자 PC의 `~/.cursor/skills/gstack-review/` — **심층 코드 리뷰**용. 없으면 생략합니다.                                                        |
| **`.cursor/skills/agent-lessons/`**         | 반복 실수·PR 빈틈을 **`LESSONS.md` 한 줄**로 쌓아, 다음 작업에서 다시 읽게 합니다.                                                              |

요약하면 **검증은 도구(`verify`)**, **깊은 리뷰는 스킬(gstack)**, **맥락·실수 축적은 레포 안 교훈 로그**로 나눈 구조입니다.

### 사용 방법 (권장 순서)

1. **실행 계획이 있으면** 저장소 루트에서 `npm run exec-plan-init -- <slug>` 로 워크트리와 `docs/exec-plans/active/exec-plan-<slug>.md`를 만든 뒤, **계획 파일을 채웁니다.**
2. Cursor 채팅에서 **`@AGENTS.md`** 와 **`@docs/exec-plans/active/exec-plan-<slug>.md`** (또는 워크트리의 `EXEC_PLAN.md`)를 같이 걸고 작업을 시킵니다.
3. 워크트리 경로에서 개발·커밋합니다. **`main`의 `src/`는 직접 고치지 않는 것이 기본**입니다.
4. PR 전: **`npm run verify` 통과** → **[`LESSONS.md`](.cursor/skills/agent-lessons/LESSONS.md) 확인** → (설치되어 있으면) **`gstack-review` 스킬**로 리뷰·반영 → 다시 `verify` → **`npm run pr:open`** 등으로 PR. 자세한 순서는 `AGENTS.md` 절 3·4를 따릅니다.
5. 실수나 빈틈이 나오면 **「`LESSONS.md`에 기록해」**라고 하면, 에이전트가 [agent-lessons 스킬](.cursor/skills/agent-lessons/SKILL.md)에 따라 한 줄 남깁니다.

워크플로·PR 본문·스크립트 표는 [`docs/workflows/README.md`](docs/workflows/README.md), [`scripts/README.md`](scripts/README.md)를 참고하면 됩니다.

### 선택: gstack Cursor 스킬 갱신

gstack을 [로컬 클론](https://github.com/garrytan/gstack)해 두었고 Cursor용 스킬을 생성해 쓰는 경우, 업데이트 후 아래를 해당 클론 루트에서 실행합니다 (Bun 필요).

```powershell
$env:PATH = "$HOME\.bun\bin;" + $env:PATH
cd <gstack 클론 경로>
bun install
bun run gen:skill-docs --host cursor
```

사용자 `~/.cursor/skills`에 정션으로 연결해 두었다면 **재연결 없이** 스킬 내용만 갱신됩니다.

---

## License

MIT
