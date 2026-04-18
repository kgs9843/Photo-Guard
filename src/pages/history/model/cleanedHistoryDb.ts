/**
 * IndexedDB persistence for cleaned photos + history metadata.
 * @see docs/references/indexeddb-using.md
 */

import type { CleanedHistoryRecordStored } from '@/pages/history/model/types'

const DB_NAME = 'photo-guard-v1'
const DB_VERSION = 1
const STORE = 'cleanedHistory'

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onerror = () =>
        reject(req.error ?? new Error('indexedDB open failed'))
      req.onsuccess = () => resolve(req.result)
      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' })
        }
      }
    } catch (e) {
      reject(e)
    }
  })

export const putCleanedRecord = async (
  record: CleanedHistoryRecordStored
): Promise<void> => {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('put failed'))
    tx.onabort = () => reject(tx.error ?? new Error('put aborted'))
    tx.objectStore(STORE).put(record)
  })
  db.close()
}

export const getAllCleanedRecords = async (): Promise<
  CleanedHistoryRecordStored[]
> => {
  const db = await openDb()
  const rows = await new Promise<CleanedHistoryRecordStored[]>(
    (resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).getAll()
      req.onsuccess = () =>
        resolve((req.result as CleanedHistoryRecordStored[]) ?? [])
      req.onerror = () => reject(req.error ?? new Error('getAll failed'))
    }
  )
  db.close()
  return rows.sort((a, b) => b.createdAt - a.createdAt)
}

export const getCleanedRecordById = async (
  id: string
): Promise<CleanedHistoryRecordStored | undefined> => {
  const db = await openDb()
  const row = await new Promise<CleanedHistoryRecordStored | undefined>(
    (resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(id)
      req.onsuccess = () =>
        resolve(req.result as CleanedHistoryRecordStored | undefined)
      req.onerror = () => reject(req.error ?? new Error('get failed'))
    }
  )
  db.close()
  return row
}

export const deleteAllCleanedRecords = async (): Promise<void> => {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('clear failed'))
    const req = tx.objectStore(STORE).clear()
    req.onerror = () => reject(req.error ?? new Error('clear req failed'))
  })
  db.close()
}
