import exifr from 'exifr'

import type { PhotoMetadata } from '@/pages/clean/model/types'
import type {
  HistoryRecordRemovedMeta,
  OtherMetaTagDetail,
} from '@/pages/history/model/types'

const ATTRIBUTED_KEYS = new Set([
  'Make',
  'Model',
  'LensModel',
  'FocalLength',
  'FNumber',
  'ExposureTime',
  'ISO',
  'DateTimeOriginal',
  'latitude',
  'longitude',
  'GPSLatitude',
  'GPSLongitude',
])

const MAX_OTHER_TAGS = 120
const MAX_VALUE_LEN = 240

const formatExifValue = (v: unknown): string => {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') {
    return v.length > MAX_VALUE_LEN ? `${v.slice(0, MAX_VALUE_LEN)}…` : v
  }
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (v instanceof Date) {
    try {
      return v.toISOString()
    } catch {
      return String(v)
    }
  }
  if (typeof v === 'object') {
    try {
      const s = JSON.stringify(v)
      return s.length > MAX_VALUE_LEN ? `${s.slice(0, MAX_VALUE_LEN)}…` : s
    } catch {
      return '[값 표시 불가]'
    }
  }
  return String(v)
}

const collectOtherTagDetails = (
  parsed: Record<string, unknown> | null
): OtherMetaTagDetail[] => {
  if (!parsed || typeof parsed !== 'object') return []
  const keys = Object.keys(parsed)
    .filter(k => !ATTRIBUTED_KEYS.has(k))
    .sort((a, b) => a.localeCompare(b))
  const out: OtherMetaTagDetail[] = []
  for (const key of keys) {
    const raw = parsed[key]
    const valuePreview = formatExifValue(raw) || '(빈 값)'
    out.push({ key, valuePreview })
    if (out.length >= MAX_OTHER_TAGS) break
  }
  return out
}

export const buildRemovalEvidence = async (
  file: File,
  meta: PhotoMetadata
): Promise<{
  removed: HistoryRecordRemovedMeta
  lines: string[]
  otherTagDetails: OtherMetaTagDetail[]
}> => {
  const lines: string[] = []

  const gps =
    meta.latitude !== undefined &&
    meta.longitude !== undefined &&
    Number.isFinite(meta.latitude) &&
    Number.isFinite(meta.longitude)

  if (gps) {
    lines.push(
      `위치(GPS): ${meta.latitude!.toFixed(4)}, ${meta.longitude!.toFixed(4)}`
    )
  }

  const device = Boolean(meta.make || meta.model)
  if (device) {
    lines.push(
      `기기·모델: ${[meta.make, meta.model].filter(Boolean).join(' ')}`
    )
  }

  const captureTime = Boolean(meta.createdAt)
  if (captureTime && meta.createdAt) {
    lines.push(`촬영 시각: ${meta.createdAt.toString()}`)
  }

  const camera =
    Boolean(meta.lensModel) ||
    meta.focalLength !== undefined ||
    meta.fNumber !== undefined ||
    meta.exposureTime !== undefined ||
    meta.iso !== undefined
  if (camera) {
    const parts = [
      meta.lensModel,
      meta.fNumber !== undefined ? `f/${meta.fNumber}` : null,
      meta.exposureTime !== undefined ? `${meta.exposureTime}s` : null,
      meta.iso !== undefined ? `ISO ${meta.iso}` : null,
      meta.focalLength !== undefined ? `${meta.focalLength}mm` : null,
    ].filter(Boolean)
    if (parts.length > 0) {
      lines.push(`촬영 파라미터: ${parts.join(', ')}`)
    }
  }

  let parsedFull: Record<string, unknown> | null = null
  try {
    const raw = await exifr.parse(file)
    if (raw && typeof raw === 'object') {
      parsedFull = raw as Record<string, unknown>
    }
  } catch {
    parsedFull = null
  }

  const otherTagDetails = collectOtherTagDetails(parsedFull)
  const otherCount = Object.keys(parsedFull ?? {}).filter(
    k => !ATTRIBUTED_KEYS.has(k)
  ).length

  const removed: HistoryRecordRemovedMeta = {
    gps,
    device,
    captureTime,
    otherCount,
  }

  return { removed, lines, otherTagDetails }
}
