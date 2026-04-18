export const historyDetailCopy = {
  statusTitle: '보호 완료',
  statusBody: '모든 민감 정보가 안전하게 제거되었습니다.',
  sectionRemovedHeading: '제거된 메타데이터',
  sectionEvidenceHeading: '삭제 전에 탐지된 정보',
  sectionOtherTagsHeading: '기타 기술 메타데이터 태그',
  otherTagsLegacyHint:
    '이 기록에는 태그별 상세가 저장되지 않았습니다. 새로 정제한 사진부터 항목별로 표시됩니다.',
  badgeCleared: '보호됨 (삭제 완료)',
  badgeOther: (count: number) => `보호됨 (${count}개 항목 삭제 완료)`,
  notFoundTitle: '기록을 찾을 수 없습니다.',
  notFoundCta: '목록으로 돌아가기',
  saveToGallery: '갤러리에 저장',
  share: '공유하기',
  saveFailed: '이미지를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.',
  shareFailed: '공유를 완료하지 못했습니다.',
  shareUnsupported: '이 환경에서는 공유를 지원하지 않습니다.',
} as const
