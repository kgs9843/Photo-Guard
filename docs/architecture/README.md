# 아키텍처 (맵)

## 목표

- 에이전트·사람 모두 **예측 가능한 구조**에서 빠르게 변경한다.
- 문서만으로 유지가 어려운 규칙은 **린트·테스트·CI**로 옮긴다 (`npm run verify`, ESLint 등).

## Feature-Sliced Design (FSD)

이 레포는 **FSD 아이디어**를 따른다. 레이어 간 **import 방향**과 슬라이스 안의 `ui` / `model` / `api` 규칙은 아래가 **기계적으로 적용되는 SoT**다.

- **불변 규칙(짧게, 에이전트 항시 적용)**: `.cursor/rules/fsd-core.mdc`
- **슬라이스 스캐폴드·체크리스트**: `.cursor/skills/fsd-slices/SKILL.md`

여기(`docs/architecture`)에는 **배경·현재 트리·운영 관점**만 둔다. 표나 “누가 누구를 import할 수 있는지”는 `fsd-core.mdc`를 수정할 때 이 문서의 “현재 트리”와 함께 맞추면 된다.

## 현재 `src/` 트리(요약)

전체 FSD 스펙(예: `widgets`, `entities`)은 `fsd-core.mdc`에 있으나, **지금 코드베이스에 실제로 있는 상위 폴더**는 다음뿐이다.

```
src/
├── app/          # 셸, 프로바이더 (라우팅 래퍼 등)
├── pages/        # 기능 단위 슬라이스 (라우트 단위 페이지)
│   ├── dashboard/
│   ├── clean/
│   ├── cleaning/
│   ├── history/
│   ├── settings/
│   ├── privacy/
│   └── licenses/
└── shared/       # 공용 UI·유틸 (다른 레이어 import 금지 — fsd-core 표 참고)
```

슬라이스 규칙: `pages/<이름>/` 아래에 `ui/`, `model/`, 필요 시 `api/`를 둔다. 진입은 각 슬라이스의 `index.ts`에서 lazy export 하는 패턴을 쓴다.

## 알려진 크로스 슬라이스 의존

이상적이지 않지만 **현재 허용된 예외**로 남아 있는 경우가 있다. 구조를 바꿀 때는 한 번에 정리하는 편이 좋다.

- `pages/cleaning`이 `pages/history/model` 등 **다른 페이지 슬라이스의 model**을 import 하는 경로가 있다 (IndexedDB 기록 저장). 장기적으로는 `shared` 하위 저장소 모듈로 내리거나 전용 `entities`/`features` 슬라이스로 옮기는 식으로 줄일 수 있다.

## 이 문서에 이어서 쓸 수 있는 것

- 라우팅·코드 스플리팅 요약 (`App.tsx` ↔ `pages/*/index`)
- 데이터 저장소(IndexedDB)와 주요 사용자 플로우 관계 한 페이지 다이어그램
