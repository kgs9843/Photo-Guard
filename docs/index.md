# docs/ (기록 시스템)

이 디렉터리는 프로젝트 지식의 **기록 시스템(SoT)** 입니다. 에이전트/사람 모두 여기의 문서를 기준으로 추론합니다.

## 목차

- `docs/architecture/README.md`: 아키텍처 지도(레이어링, 경계, 규칙)
- `docs/product/README.md`: 제품/도메인 용어, 사용자 여정, 수용 기준
- `docs/plans/active/README.md`: 실행계획(Exec plan) 템플릿과 운영 방식
- `docs/plans/completed/README.md`: 완료된 실행계획 아카이브
- `docs/references/README.md`: 외부 문서/근거 고정(예: Context7 조회 결과)
- `docs/workflows/pr-loop.md`: PR 생성/리뷰 반영 루프
- `docs/workflows/bugfix-loop.md`: 버그 재현→수정→검증 루프

## 운영 원칙(짧게)

- 큰 만능 문서 1개로 모든 걸 해결하지 않습니다. 문서는 **짧고 링크 중심**으로 유지합니다.
- 외부에만 존재하는 지식은 없는 것으로 취급합니다. 결정/규칙/제약은 **반드시 레포에 버전관리**합니다.
- 반복적으로 깨지는 규칙은 문서가 아니라 **린트/테스트/CI**로 승격합니다.
