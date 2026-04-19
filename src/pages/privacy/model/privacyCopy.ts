import { privacyCopyEn } from '@/pages/privacy/model/privacyCopy.en'
import { privacyCopyKo } from '@/pages/privacy/model/privacyCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type PrivacyCopyBundle = typeof privacyCopyKo

const byLocale: Record<AppLocale, PrivacyCopyBundle> = {
  ko: privacyCopyKo,
  en: privacyCopyEn as unknown as PrivacyCopyBundle,
}

export const getPrivacyCopy = (locale: AppLocale): PrivacyCopyBundle =>
  byLocale[locale] ?? privacyCopyKo
