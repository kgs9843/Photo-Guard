# Photo Guard

## 개인용 웹앱입니다. 사진을 고르고 EXIF 성격의 메타데이터를 확인한 뒤, 브라우저 안에서 다시 인코딩해 메타데이터를 제거합니다. 공유하기 전에 위치, 촬영 시각, 기기 단서가 파일과 함께 나가지 않게 하려는 용도입니다. 처리는 모두 클라이언트에서 이루어지며, 원본을 서버로 올리지 않습니다.

## 기능

- **홈(대시보드)**: 이미지 선택 (한 번에 최대 10장)
- **Clean**: 메타데이터 요약 확인 후 정제 단계로 이동
- **Cleaning**: 진행 UI, 완료 후 정제본 다운로드 또는 공유
- **기록**: 성공한 정제 결과를 IndexedDB에 저장하고, 썸네일과 제거 요약으로 목록·상세 확인
- **설정**: 내보내기 형식(JPEG / PNG), 로컬 기록 삭제

---

## 정제 방식

## `createImageBitmap`으로 디코딩한 뒤 캔버스에 그리고, `toBlob`으로 JPEG 또는 PNG로 내보냅니다(JPEG는 품질 **0.96**). 비트맵을 새로 만들기 때문에 원본에 붙어 있던 임베드 메타데이터는 결과물에 대체로 넘어가지 않습니다. 특정 EXIF 태그만 골라 지우는 방식이 아니라, 강한(재인코딩 기반) 제거에 가깝습니다.

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

---

## 소스 구조

```

src/
├── app/ # shell (AppShell, TopBar), providers
├── pages/ # dashboard, clean, cleaning, history, settings, privacy, licenses, offline
├── shared/ # shared UI
├── App.tsx
└── main.tsx

```

슬라이스마다 ui와 model 폴더를 두는 등 Feature-Sliced Design에 가깝게 구성했습니다.

---

## License

MIT
```
