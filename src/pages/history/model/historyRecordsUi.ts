import type {
  CleanedHistoryRecordStored,
  HistoryRecord,
} from '@/pages/history/model/types'

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  return `${(mb / 1024).toFixed(1)} GB`
}

const formatDate = (ms: number): string => {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(ms))
  } catch {
    return new Date(ms).toISOString().slice(0, 10)
  }
}

export const cleanedStoredToHistoryRecord = (
  row: CleanedHistoryRecordStored,
  imageSrc: string
): HistoryRecord => ({
  id: row.id,
  fileName: row.fileName,
  dateLabel: formatDate(row.createdAt),
  sizeLabel: formatSize(row.sizeBytes),
  imageSrc,
  imageAlt: row.imageAlt,
  status: row.status,
  removed: row.removed,
  removedEvidenceLines: row.removedEvidenceLines,
  otherTagDetails: row.otherTagDetails,
  outputMime: row.outputMime,
})
