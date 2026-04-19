import { historyDetailCopyEn } from '@/pages/history/model/historyDetailCopy.en'
import { historyDetailCopyKo } from '@/pages/history/model/historyDetailCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type HistoryDetailCopyBundle = typeof historyDetailCopyKo

const byLocale: Record<AppLocale, HistoryDetailCopyBundle> = {
  ko: historyDetailCopyKo,
  en: historyDetailCopyEn as unknown as HistoryDetailCopyBundle,
}

export const getHistoryDetailCopy = (
  locale: AppLocale
): HistoryDetailCopyBundle => byLocale[locale] ?? historyDetailCopyKo
