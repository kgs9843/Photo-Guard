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

/** 기본값(설정·`LocaleProvider`에서 `getHomeCopy(locale)`로 덮어씀). */
export const DEFAULT_HOME_LOCALE: HomeLocale = 'ko'

const HOME_COPY: Record<HomeLocale, HomeCopy> = {
  ko: homeCopyKo,
  en: homeCopyEn,
}

export const getHomeCopy = (
  locale: HomeLocale = DEFAULT_HOME_LOCALE
): HomeCopy => HOME_COPY[locale] ?? HOME_COPY[DEFAULT_HOME_LOCALE]
