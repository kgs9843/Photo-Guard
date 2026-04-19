import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { LocaleContext } from '@/shared/lib/localeContext'
import {
  APP_LOCALE_CHANGED_EVENT,
  APP_LOCALE_STORAGE_KEY,
  type AppLocale,
  DEFAULT_APP_LOCALE,
  readStoredAppLocale,
  writeStoredAppLocale,
} from '@/shared/model/appLocale'

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    try {
      return readStoredAppLocale()
    } catch {
      return DEFAULT_APP_LOCALE
    }
  })

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== APP_LOCALE_STORAGE_KEY) return
      try {
        setLocaleState(readStoredAppLocale())
      } catch {
        /* ignore */
      }
    }
    const onCustom = () => {
      try {
        setLocaleState(readStoredAppLocale())
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(APP_LOCALE_CHANGED_EVENT, onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(APP_LOCALE_CHANGED_EVENT, onCustom)
    }
  }, [])

  const setLocale = useCallback((next: AppLocale) => {
    try {
      writeStoredAppLocale(next)
      setLocaleState(next)
      window.dispatchEvent(new Event(APP_LOCALE_CHANGED_EVENT))
    } catch {
      setLocaleState(next)
    }
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale]
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
