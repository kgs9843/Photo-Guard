export const settingsHero = {
  title: 'Photo Guard',
  subtitle: '당신의 소중한 순간을 안전하게',
} as const

export const settingsSections = {
  appInfo: '앱 정보',
} as const

export const exportFormatBlock = {
  title: '이미지 형식',
  description: '정제된 이미지의 파일 포맷',
} as const

export const exportFormatLabels = {
  jpg: 'JPG',
  png: 'PNG',
} as const

export type ExportFormatKey = keyof typeof exportFormatLabels

export const clearHistoryBlock = {
  title: '활동 기록 삭제',
  description: '모든 정제 이력을 기기에서 삭제합니다',
  done: '기록을 삭제했습니다.',
  empty: '삭제할 기록이 없습니다.',
  failed: '기록을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.',
} as const

export const clearHistoryModal = {
  body: '모든 처리 이력을 기기에서 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.',
  delete: '삭제하기',
  cancel: '취소',
} as const

export const appInfo = {
  versionLabel: '버전 정보',
  latestVersionSuffix: '',
  terms: '이용약관 및 개인정보 처리방침',
  licenses: '오픈소스 라이선스',
} as const
