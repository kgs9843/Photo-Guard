import type { AppLocale } from '@/shared/model/appLocale'

export type ShellCopy = {
  backAria: string
  tabHome: string
  tabHistory: string
  tabSettings: string
  headerPhotoGuard: string
  headerSettings: string
  headerHistory: string
  headerHistoryDetail: string
}

const ko: ShellCopy = {
  backAria: '뒤로',
  tabHome: '홈',
  tabHistory: '기록',
  tabSettings: '설정',
  headerPhotoGuard: 'Photo Guard',
  headerSettings: '설정',
  headerHistory: '기록',
  headerHistoryDetail: '보호된 사진 정보',
}

const en: ShellCopy = {
  backAria: 'Back',
  tabHome: 'Home',
  tabHistory: 'History',
  tabSettings: 'Settings',
  headerPhotoGuard: 'Photo Guard',
  headerSettings: 'Settings',
  headerHistory: 'History',
  headerHistoryDetail: 'Protected photo',
}

const TABLE: Record<AppLocale, ShellCopy> = {
  ko,
  en,
}

export const getShellCopy = (locale: AppLocale): ShellCopy =>
  TABLE[locale] ?? TABLE.ko
