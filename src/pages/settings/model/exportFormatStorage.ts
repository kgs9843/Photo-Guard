import type { ExportFormatKey } from '@/pages/settings/model/settingsCopy'

const STORAGE_KEY = 'photo-guard:export-format'

const isFormat = (v: string): v is ExportFormatKey => v === 'jpg' || v === 'png'

export const getExportFormat = (): ExportFormatKey => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return 'jpg'
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw && isFormat(raw)) return raw
  } catch {
    /* ignore */
  }
  return 'jpg'
}

export const setExportFormat = (format: ExportFormatKey): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.setItem(STORAGE_KEY, format)
  } catch {
    /* ignore */
  }
}

export const exportFormatMime = (
  format: ExportFormatKey,
): 'image/jpeg' | 'image/png' =>
  format === 'png' ? 'image/png' : 'image/jpeg'
