import { cleaningCopyEn } from '@/pages/cleaning/model/cleaningCopy.en'
import { cleaningCopyKo } from '@/pages/cleaning/model/cleaningCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type CleaningUiCopy = typeof cleaningCopyKo

const byLocale: Record<AppLocale, CleaningUiCopy> = {
  ko: cleaningCopyKo,
  en: cleaningCopyEn as unknown as CleaningUiCopy,
}

export const getCleaningCopy = (locale: AppLocale): CleaningUiCopy =>
  byLocale[locale] ?? cleaningCopyKo
