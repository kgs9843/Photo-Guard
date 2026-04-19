import { offlineCopyEn } from '@/pages/offline/model/offlineCopy.en'
import { offlineCopyKo } from '@/pages/offline/model/offlineCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type OfflineCopyBundle = typeof offlineCopyKo

const byLocale: Record<AppLocale, OfflineCopyBundle> = {
  ko: offlineCopyKo,
  en: offlineCopyEn as unknown as OfflineCopyBundle,
}

export const getOfflineCopy = (locale: AppLocale): OfflineCopyBundle =>
  byLocale[locale] ?? offlineCopyKo
