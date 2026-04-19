import { createContext } from 'react'

import type { AppLocale } from '@/shared/model/appLocale'

export type LocaleContextValue = {
  locale: AppLocale
  setLocale: (next: AppLocale) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
