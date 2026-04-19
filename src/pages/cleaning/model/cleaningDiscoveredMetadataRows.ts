import type { PhotoMetadata } from '@/pages/clean/model/types'

const hasRisk = (meta: PhotoMetadata | undefined) => {
  if (!meta) return false
  return meta.latitude !== undefined && meta.longitude !== undefined
}

const formatGps = (meta: PhotoMetadata) => {
  if (meta.latitude === undefined || meta.longitude === undefined) return null
  return `${meta.latitude.toFixed(5)}, ${meta.longitude.toFixed(5)}`
}

export function cleaningDiscoveredMetadataHasRows(
  isMulti: boolean,
  metas: PhotoMetadata[]
): boolean {
  if (!metas.length) return false
  if (!isMulti) {
    const m = metas[0]!
    return Boolean(
      formatGps(m) ||
      m.make ||
      m.model ||
      m.createdAt ||
      m.lensModel ||
      m.focalLength !== undefined ||
      m.fNumber !== undefined ||
      m.exposureTime !== undefined ||
      m.iso !== undefined
    )
  }
  const anyGps = metas.some(hasRisk)
  const anyDevice = metas.some(m => Boolean(m.make || m.model))
  const anyTime = metas.some(m => Boolean(m.createdAt))
  const anyCamera = metas.some(m =>
    Boolean(
      m.lensModel || m.focalLength || m.fNumber || m.exposureTime || m.iso
    )
  )
  return anyGps || anyDevice || anyTime || anyCamera
}
