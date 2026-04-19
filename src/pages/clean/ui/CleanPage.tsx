import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Layers,
  MapPin,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import TopBar from '@/app/layout/TopBar'
import { type CleanUiCopy, getCleanCopy } from '@/pages/clean/model/cleanCopy'
import { useLocale } from '@/shared/lib/useLocale'
import GradientButton from '@/shared/ui/GradientButton'

import { extractPhotoMetadata } from '../model/extractMetadata'
import type { PhotoMetadata, SelectedPhoto } from '../model/types'

type CleanLocationState = {
  photos: SelectedPhoto[]
}

const hasRisk = (meta: PhotoMetadata | undefined) => {
  if (!meta) return false
  return meta.latitude !== undefined && meta.longitude !== undefined
}

const countRisks = (metas: PhotoMetadata[] | null) => {
  if (!metas || metas.length === 0) return 0
  let risks = 0
  const anyGps = metas.some(hasRisk)
  const anyDevice = metas.some(m => Boolean(m.make || m.model))
  const anyTime = metas.some(m => Boolean(m.createdAt))
  const anyCamera = metas.some(m =>
    Boolean(
      m.lensModel || m.focalLength || m.fNumber || m.exposureTime || m.iso
    )
  )
  if (anyGps) risks += 1
  if (anyDevice) risks += 1
  if (anyTime) risks += 1
  if (anyCamera) risks += 1
  return risks
}

/** Clean 화면 ‘상세 정보 / 위험 분석’에 카드로 나올 만한 메타가 있는지 */
const hasVisibleCleanMetadata = (m: PhotoMetadata) => {
  if (
    m.latitude !== undefined &&
    m.longitude !== undefined &&
    Number.isFinite(m.latitude) &&
    Number.isFinite(m.longitude)
  ) {
    return true
  }
  if (m.make || m.model) return true
  if (m.createdAt) return true
  if (
    m.lensModel ||
    m.focalLength !== undefined ||
    m.fNumber !== undefined ||
    m.exposureTime !== undefined ||
    m.iso !== undefined
  ) {
    return true
  }
  return false
}

const canDeleteMetadataFromCleanPage = (
  isLoading: boolean,
  metas: PhotoMetadata[] | null,
  isMulti: boolean
) => {
  if (isLoading) return false
  if (!metas || metas.length === 0) return false
  if (isMulti) return metas.some(hasVisibleCleanMetadata)
  return hasVisibleCleanMetadata(metas[0]!)
}

const formatGps = (meta: PhotoMetadata) => {
  if (meta.latitude === undefined || meta.longitude === undefined) return null
  return `${meta.latitude.toFixed(5)}, ${meta.longitude.toFixed(5)}`
}

/** 단일 사진 `renderCleanMetaItems`에 나오는 카드 수(GPS·기기·촬영 시각·촬영 정보 각 0~1) */
const countCleanDetailCards = (m: PhotoMetadata): number => {
  let n = 0
  if (formatGps(m)) n += 1
  if (m.make || m.model) n += 1
  if (m.createdAt) n += 1
  if (
    m.lensModel ||
    m.focalLength !== undefined ||
    m.fNumber !== undefined ||
    m.exposureTime !== undefined ||
    m.iso !== undefined
  ) {
    n += 1
  }
  return n
}

function renderCleanMetaItems(
  isMulti: boolean,
  metas: PhotoMetadata[] | null,
  isLoading: boolean,
  copy: CleanUiCopy
) {
  if (isLoading) {
    return (
      <div className="bg-surface-container-low text-on-surface-variant rounded-[1.5rem] p-5 text-sm">
        {copy.loading}
      </div>
    )
  }

  if (!metas || metas.length === 0) {
    return (
      <div className="bg-surface-container-low text-on-surface-variant rounded-[1.5rem] p-5 text-sm">
        {copy.metadataUnavailable}
      </div>
    )
  }

  if (!isMulti) {
    const m = metas[0]!
    const gps = formatGps(m)
    return (
      <>
        {gps ? (
          <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <MapPin className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {copy.labels.gps}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-sm">{gps}</p>
            </div>
          </div>
        ) : null}

        {m.make || m.model ? (
          <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <Smartphone className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {copy.labels.device}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-sm">
                {[m.make, m.model].filter(Boolean).join(' ')}
              </p>
            </div>
          </div>
        ) : null}

        {m.createdAt ? (
          <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <CalendarDays className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {copy.labels.captureTime}
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
          <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
            <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
              <Camera className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-base font-bold">
                {copy.labels.shooting}
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

  return (
    <>
      {anyGps ? (
        <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <MapPin className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {copy.labels.gps}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {copy.multiHints.gps}
            </p>
          </div>
        </div>
      ) : null}
      {anyDevice ? (
        <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <Smartphone className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {copy.labels.device}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {copy.multiHints.device}
            </p>
          </div>
        </div>
      ) : null}
      {anyTime ? (
        <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <CalendarDays className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {copy.labels.captureTime}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {copy.multiHints.captureTime}
            </p>
          </div>
        </div>
      ) : null}
      {anyCamera ? (
        <div className="bg-surface-container-low flex items-center gap-4 rounded-[1.5rem] p-5">
          <div className="bg-surface-container-lowest text-primary flex size-12 items-center justify-center rounded-xl shadow-sm">
            <Camera className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-on-surface text-base font-bold">
              {copy.labels.shooting}
            </p>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {copy.multiHints.shooting}
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}

const MultiPhotoStack = ({
  photos,
  copy,
}: {
  photos: SelectedPhoto[]
  copy: CleanUiCopy
}) => {
  const layers = photos.slice(0, 3)
  const remaining = Math.max(0, photos.length - layers.length)

  const layerClass = (idx: number) => {
    if (idx === 0) return 'translate-x-[-20%] -rotate-6 opacity-80 shadow-lg'
    if (idx === 1) return 'translate-x-[15%] rotate-3 opacity-90 shadow-xl'
    return 'opacity-100 shadow-2xl'
  }

  return (
    <section className="relative mt-4 mb-10 flex h-72 items-center justify-center">
      <div className="relative aspect-4/5 w-56">
        {layers.map((p, idx) => (
          <div
            key={p.objectUrl}
            className={[
              'bg-surface-container-low absolute inset-0 overflow-hidden rounded-4xl border border-white/20',
              layerClass(idx),
            ].join(' ')}
          >
            <img
              className="h-full w-full object-cover"
              alt={p.name}
              src={p.objectUrl}
            />
          </div>
        ))}

        {remaining > 0 ? (
          <div className="bg-surface-container-low absolute inset-0 overflow-hidden rounded-4xl border-2 border-white shadow-2xl">
            <img
              className="h-full w-full object-cover"
              alt={layers[layers.length - 1]?.name ?? copy.stackExtraAlt}
              src={layers[layers.length - 1]?.objectUrl ?? photos[0]!.objectUrl}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
              <span className="text-3xl font-extrabold">+{remaining}</span>
              <span className="mt-1 text-xs font-medium tracking-widest">
                {copy.stackExtraLabel}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

const CleanPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { locale } = useLocale()
  const copy = useMemo(() => getCleanCopy(locale), [locale])
  const state = (location.state ?? null) as CleanLocationState | null

  const photos = useMemo(() => state?.photos ?? [], [state])
  const first = photos[0] ?? null
  const isMulti = photos.length > 1

  const [isLoading, setIsLoading] = useState(false)
  const [metas, setMetas] = useState<PhotoMetadata[] | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (photos.length === 0) {
        return
      }
      setIsLoading(true)
      try {
        const results = await Promise.all(photos.map(extractPhotoMetadata))
        if (!cancelled) {
          setMetas(results)
        }
      } catch {
        if (!cancelled) {
          setMetas([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [photos])

  useEffect(() => {
    return () => {
      for (const photo of photos) {
        try {
          URL.revokeObjectURL(photo.objectUrl)
        } catch {
          // ignore
        }
      }
    }
  }, [photos])

  const fileLabel = useMemo(() => {
    if (!first) return ''
    return first.name
  }, [first])

  const canDeleteMetadata = canDeleteMetadataFromCleanPage(
    isLoading,
    metas,
    isMulti
  )

  if (!first) {
    return (
      <div className="bg-surface text-on-surface min-h-dvh">
        <TopBar
          left={
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:bg-surface-container-low flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="size-5" aria-hidden />
              {copy.empty.back}
            </button>
          }
        />

        <main className="mx-auto max-w-2xl px-6 pt-24 pb-24">
          <section className="bg-surface-container-lowest rounded-4xl p-6 shadow-sm">
            <div className="text-xl font-bold tracking-tight">
              {copy.empty.title}
            </div>
            <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
              {copy.empty.body}
            </p>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-surface text-on-surface flex min-h-dvh flex-col">
      <TopBar
        left={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hover:bg-surface-container-low flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
            aria-label={copy.topBarBackAria}
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
        }
        right={
          <div className="text-on-surface-variant text-md mr-2 flex items-center gap-2 font-semibold">
            {isMulti ? (
              <>
                <Layers className="size-4" aria-hidden />
                <span>{copy.selectedMany(photos.length)}</span>
              </>
            ) : (
              <span>{copy.selectedOne}</span>
            )}
          </div>
        }
      />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pt-20 pb-28">
        {isMulti ? (
          <MultiPhotoStack photos={photos} copy={copy} />
        ) : (
          <section className="mt-4 mb-8">
            <div className="bg-surface-container-low shadow-primary/5 relative aspect-square w-full overflow-hidden rounded-4xl shadow-xl">
              <img
                alt={fileLabel}
                className="h-full w-full object-cover"
                src={first.objectUrl}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </section>
        )}

        <section className="mb-8">
          <div className="bg-primary-fixed flex items-center justify-between gap-4 rounded-4xl p-6">
            <div className="min-w-0">
              <h2 className="text-on-surface text-xl font-extrabold tracking-tight">
                {isMulti
                  ? copy.heroMulti(photos.length)
                  : copy.heroSingleMeta(
                      metas?.[0] ? countCleanDetailCards(metas[0]) : 0
                    )}
              </h2>
              <p className="text-on-surface-variant mt-1 text-[12px] font-medium">
                {isLoading
                  ? copy.analyzing
                  : isMulti
                    ? copy.multiRiskLine(countRisks(metas))
                    : hasRisk(metas?.[0])
                      ? copy.singleRiskYes
                      : copy.singleRiskNo}
              </p>
            </div>
            <div className="bg-primary-container flex items-center justify-center rounded-2xl p-3 text-white shadow-lg">
              <ShieldCheck className="size-8" aria-hidden />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-on-surface-variant px-1 text-sm font-bold tracking-wide">
            {isMulti ? copy.sectionRisk : copy.sectionDetail}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {renderCleanMetaItems(isMulti, metas, isLoading, copy)}
          </div>
        </section>

        <div className="text-on-surface-variant mt-8 mr-12 mb-6 ml-6 text-sm leading-relaxed not-italic opacity-60">
          {copy.disclaimer}
        </div>
      </main>

      <footer className="from-surface via-surface/95 sticky bottom-0 w-full bg-linear-to-t to-transparent px-6 pt-4 pb-8 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl">
          <GradientButton
            ariaLabel={copy.ctaAria}
            disabled={!canDeleteMetadata}
            className={canDeleteMetadata ? '' : 'from-[#a1a1a1] to-[#bdbdbd]'}
            onClick={() => {
              if (!canDeleteMetadata) return
              try {
                navigate('/cleaning', { state: { photos } })
              } catch {
                // ignore
              }
            }}
          >
            <span className="inline-flex items-center justify-center gap-3">
              <Sparkles className="size-6" aria-hidden />
              {isMulti ? copy.ctaMulti : copy.ctaSingle}
            </span>
          </GradientButton>
        </div>
      </footer>
    </div>
  )
}

export default CleanPage
