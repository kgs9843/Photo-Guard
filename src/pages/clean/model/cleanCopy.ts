import { cleanCopyEn } from '@/pages/clean/model/cleanCopy.en'
import { cleanCopyKo } from '@/pages/clean/model/cleanCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type CleanUiCopy = typeof cleanCopyKo

const byLocale: Record<AppLocale, CleanUiCopy> = {
  ko: cleanCopyKo,
  en: cleanCopyEn as unknown as CleanUiCopy,
}

export const getCleanCopy = (locale: AppLocale): CleanUiCopy =>
  byLocale[locale] ?? cleanCopyKo
