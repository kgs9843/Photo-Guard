import { historyListCopyEn } from '@/pages/history/model/historyListCopy.en'
import { historyListCopyKo } from '@/pages/history/model/historyListCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type HistoryListCopyBundle = typeof historyListCopyKo

const byLocale: Record<AppLocale, HistoryListCopyBundle> = {
  ko: historyListCopyKo,
  en: historyListCopyEn as unknown as HistoryListCopyBundle,
}

export const getHistoryListCopy = (locale: AppLocale): HistoryListCopyBundle =>
  byLocale[locale] ?? historyListCopyKo
