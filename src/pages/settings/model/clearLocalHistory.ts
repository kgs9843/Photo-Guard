import {
  deleteAllCleanedRecords,
  getAllCleanedRecords,
} from '@/pages/history/model/cleanedHistoryDb'

const PHOTO_GUARD_STORAGE_PREFIX = 'photo-guard:'
const EXPORT_FORMAT_KEY = 'photo-guard:export-format'

export const clearPhotoGuardLocalHistory = async (): Promise<number> => {
  let idbCleared = 0

  try {
    const existing = await getAllCleanedRecords()
    idbCleared = existing.length
    await deleteAllCleanedRecords()
  } catch {
    /* continue — still try to clear localStorage */
  }

  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return idbCleared
    }

    const keys: string[] = []
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i)
      if (!key) continue
      if (!key.startsWith(PHOTO_GUARD_STORAGE_PREFIX)) continue
      if (key === EXPORT_FORMAT_KEY) continue
      keys.push(key)
    }

    for (const key of keys) {
      window.localStorage.removeItem(key)
    }

    return idbCleared + keys.length
  } catch {
    return -1
  }
}
