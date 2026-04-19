export const cleaningCopyKo = {
  backAria: '뒤로',
  progress: {
    statusDone: '완료',
    statusRunning: '처리 중…',
  },
  badges: {
    done: '보호됨',
    running: '정제 중',
  },
  headlineDone: '삭제 완료',
  headlineRunning: '메타데이터 제거 중',
  sublineDone: (total: number) =>
    `${total}장의 사진에서 위치 및 기기 정보가 삭제되었습니다.`,
  sublineRunning: (total: number, done: number) =>
    `${total}장의 사진 중 ${done}장 처리 중...`,
  sublineNoPhotos: '선택된 사진이 없습니다.',
  failedLine: (n: number) => `${n}장을 처리하지 못했습니다.`,
  statusCardLabel: '상태',
  statusDataDone: '데이터 보호 완료',
  cardGpsLabel: 'GPS 메타데이터',
  cardDeviceLabel: '기기 식별',
  cardValueRemoved: '제거됨',
  cardValueWaiting: '대기',
  cardValueCleaned: '정제됨',
  cardValuePending: '보류',
  saveCta: '갤러리에 저장',
  saveDisabled: '처리 완료 후 저장할 수 있습니다',
  shareCta: '바로 공유하기',
  shareTitle: 'Photo Guard',
  shareText: '정제된 사진',
} as const
