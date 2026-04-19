export type AppLocale = 'ko' | 'en'

export const APP_LOCALE_STORAGE_KEY = 'photo-guard:locale'

export const DEFAULT_APP_LOCALE: AppLocale = 'ko'

export const APP_LOCALE_CHANGED_EVENT = 'photo-guard:locale-changed'

export const readStoredAppLocale = (): AppLocale => {
  try {
    const v = localStorage.getItem(APP_LOCALE_STORAGE_KEY)
    if (v === 'en' || v === 'ko') {
      return v
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_APP_LOCALE
}

export const writeStoredAppLocale = (locale: AppLocale): void => {
  try {
    localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
}
