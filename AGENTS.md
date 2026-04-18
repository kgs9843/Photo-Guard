<!-- # AGENTS.md (맵)

이 파일은 “매뉴얼”이 아니라 **지도(map)** 입니다. 상세 규칙/설계/결정은 `docs/`에 있습니다.

## 시작점(필수)

- `docs/index.md`: 문서 목차(SoT)
- `.cursor/rules/project-constraints.mdc`: 프로젝트 불변 규칙(한국어, try-catch, eslint, @theme)
- `.cursor/rules/fsd-core.mdc`: FSD 레이어 구조·의존성(항상 적용)
- `.cursor/skills/fsd-slices/SKILL.md`: FSD 슬라이스 폴더 템플릿·체크리스트(슬라이스 생성/리팩터 시 스킬로 적용)

## 작업 유형별로 먼저 볼 문서

- **기능 추가/수정**: `docs/plans/active/README.md` (실행계획 템플릿), `docs/product/README.md`
- **버그 수정**: `docs/workflows/bugfix-loop.md`
- **PR 만들기/리뷰 대응**: `docs/workflows/pr-loop.md`
- **아키텍처/구조 변경**: `docs/architecture/README.md`
- **외부 라이브러리/도구 문서 확인이 필요한 작업**: `.cursor/skills/context7/SKILL.md`+ `docs/references/README.md`

## 문서 운영 원칙(요약)

- 레포 밖에만 존재하는 지식(채팅/노션/구글독 등)은 **없는 것**으로 간주합니다.
- 문서로 충분하지 않은 반복 문제는 린트/테스트/CI로 **기계적으로 강제**합니다. -->
