import { CalendarDays, Camera, MapPin, Smartphone } from 'lucide-react'

import type { CleanUiCopy } from '@/pages/clean/model/cleanCopy'
import type { PhotoMetadata } from '@/pages/clean/model/types'

import { cleaningDiscoveredMetadataHasRows } from '../model/cleaningDiscoveredMetadataRows'

const hasRisk = (meta: PhotoMetadata | undefined) => {
  if (!meta) return false
  return meta.latitude !== undefined && meta.longitude !== undefined
}

const formatGps = (meta: PhotoMetadata) => {
  if (meta.latitude === undefined || meta.longitude === undefined) return null
  return `${meta.latitude.toFixed(5)}, ${meta.longitude.toFixed(5)}`
}

type Props = {
  isMulti: boolean
  metas: PhotoMetadata[]
  cleanCopy: CleanUiCopy
}

/**
 * CleanPage `renderCleanMetaItems`와 동일한 정보·카드 스타일로,
 * 정제 완료 화면에서 “발견되어 제거된” 메타데이터를 나열합니다.
 */
export function CleaningDiscoveredMetadataList({
  isMulti,
  metas,
  cleanCopy,
}: Props) {
  if (!metas.length) {
    return (
      <p className="text-on-surface-variant rounded-[1.5rem] p-5 text-sm">
        {cleanCopy.metadataUnavailable}
      </p>
    )
  }

  if (!isMulti) {
    const m = metas[0]!
    if (!cleaningDiscoveredMetadataHasRows(false, metas)) {
      return (
        <p className="bg-surface-container-low text-on-surface-variant border-outline-variant/5 rounded-[1.5rem] border p-5 text-sm">
          {cleanCopy.metadataUnavailable}
        </p>
      )
    }
    const gps = formatGps(m)
    return (
      <>
        {gps ? (
          <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <MapPin className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {cleanCopy.labels.gps}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-sm">{gps}</p>
            </div>
          </div>
        ) : null}

        {m.make || m.model ? (
          <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <Smartphone className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {cleanCopy.labels.device}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-sm">
                {[m.make, m.model].filter(Boolean).join(' ')}
              </p>
            </div>
          </div>
        ) : null}

        {m.createdAt ? (
          <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <CalendarDays className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {cleanCopy.labels.captureTime}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-sm">
                {m.createdAt.toString()}
              </p>
            </div>
          </div>
        ) : null}

        {m.lensModel ||
        m.focalLength ||
        m.fNumber ||
        m.exposureTime ||
        m.iso ? (
          <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <Camera className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {cleanCopy.labels.shooting}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-sm">
                {[
                  m.lensModel,
                  m.fNumber !== undefined ? `f/${m.fNumber}` : null,
                  m.exposureTime !== undefined ? `${m.exposureTime}s` : null,
                  m.iso !== undefined ? `ISO ${m.iso}` : null,
                  m.focalLength !== undefined ? `${m.focalLength}mm` : null,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>
        ) : null}
      </>
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

  if (!anyGps && !anyDevice && !anyTime && !anyCamera) {
    return (
      <p className="bg-surface-container-low text-on-surface-variant border-outline-variant/5 rounded-[1.5rem] border p-5 text-sm">
        {cleanCopy.metadataUnavailable}
      </p>
    )
  }

  return (
    <>
      {anyGps ? (
        <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <MapPin className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {cleanCopy.labels.gps}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {cleanCopy.multiHints.gps}
            </p>
          </div>
        </div>
      ) : null}
      {anyDevice ? (
        <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <Smartphone className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {cleanCopy.labels.device}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {cleanCopy.multiHints.device}
            </p>
          </div>
        </div>
      ) : null}
      {anyTime ? (
        <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <CalendarDays className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {cleanCopy.labels.captureTime}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {cleanCopy.multiHints.captureTime}
            </p>
          </div>
        </div>
      ) : null}
      {anyCamera ? (
        <div className="bg-surface-container-low border-outline-variant/5 flex items-center gap-4 rounded-[1.5rem] border p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <Camera className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {cleanCopy.labels.shooting}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {cleanCopy.multiHints.shooting}
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
