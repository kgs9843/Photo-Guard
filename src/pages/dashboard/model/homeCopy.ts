import { homeCopyEn } from '@/pages/dashboard/model/homeCopy.en'
import { homeCopyKo } from '@/pages/dashboard/model/homeCopy.ko'
import type {
  HomeCopy,
  HomeLocale,
} from '@/pages/dashboard/model/homeCopy.types'

export { homeCopyEn } from '@/pages/dashboard/model/homeCopy.en'
export { homeCopyKo } from '@/pages/dashboard/model/homeCopy.ko'
export type {
  HomeCopy,
  HomeLocale,
  PrivacyTip,
} from '@/pages/dashboard/model/homeCopy.types'

/** 앱 기본 홈(대시보드) 카피 언어. 추후 설정·i18n과 연동 시 이 값만 바꾸면 됩니다. */
export const DEFAULT_HOME_LOCALE: HomeLocale = 'ko'

const HOME_COPY: Record<HomeLocale, HomeCopy> = {
  ko: homeCopyKo,
  en: homeCopyEn,
}

export const getHomeCopy = (
  locale: HomeLocale = DEFAULT_HOME_LOCALE
): HomeCopy => HOME_COPY[locale] ?? HOME_COPY[DEFAULT_HOME_LOCALE]
