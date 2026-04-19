import { useContext } from 'react'

import type { LocaleContextValue } from '@/shared/lib/localeContext'
import { LocaleContext } from '@/shared/lib/localeContext'

export const useLocale = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}
