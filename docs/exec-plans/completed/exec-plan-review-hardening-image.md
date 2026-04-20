# 실행 계획: review-hardening-image

## 메타

- **slug**: `review-hardening-image`
- **브랜치**: `exec-plan/review-hardening-image`
- **워크트리**: `C:/Users/rlarl/OneDrive/Desktop/photo-guard-worktrees/review-hardening-image` (머지 후 제거됨)
- **프리뷰 포트(제안)**: `5231` (`npm run dev -- --port 5231` 등)
- **로그 디렉터리**: (워크트리 제거됨)

## 1. 목표

gstack-review에서 지적한 이미지 디코딩·실패 가시성·문서 정합을 반영한다.

## 2. 접근법

`stripMetadata`에 해상도 캡·폴백, `StripOutcome` API, Cleaning UI 안내, README·`.gitattributes`.

## 3. 단계별 계획

1. 워크트리에서 구현·`verify`
2. PR (#4) 머지
3. 워크트리·브랜치·실행 계획 아카이브

## 4. 완료 기준

- [x] `npm run verify` 통과
- [x] `src/` 변경이 요구사항과 일치
- [ ] (선택) 수동 시나리오 확인

## 5. 롤백

- `main`은 직접 수정하지 않음. 문제 시 이 브랜치/PR 폐기 후 워크트리 제거:
  - `git worktree remove "C:/Users/rlarl/OneDrive/Desktop/photo-guard-worktrees/review-hardening-image"`
  - `git branch -D exec-plan/review-hardening-image` (병합되지 않은 경우)

---

## PR (머지 완료)

- **PR:** https://github.com/kgs9843/Photo-Guard/pull/4
- **기록 시각 (UTC):** 2026-04-20 — `active` → `completed` 로컬 정리
