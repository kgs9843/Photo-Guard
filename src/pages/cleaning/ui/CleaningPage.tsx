import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Share2,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import TopBar from '@/app/layout/TopBar'
import { extractPhotoMetadata } from '@/pages/clean/model/extractMetadata'
import {
  type CleaningUiCopy,
  getCleaningCopy,
} from '@/pages/cleaning/model/cleaningCopy'
import { putCleanedRecord } from '@/pages/history/model/cleanedHistoryDb'
import { dispatchHistoryUpdated } from '@/pages/history/model/historyEvents'
import {
  exportFormatMime,
  getExportFormat,
} from '@/pages/settings/model/exportFormatStorage'
import { useLocale } from '@/shared/lib/useLocale'
import GradientButton from '@/shared/ui/GradientButton'

import { buildRemovalEvidence } from '../model/removalEvidence'
import { stripImageMetadata } from '../model/stripMetadata'
import type {
  CleaningJob,
  CleaningProgress,
  CleaningResultItem,
} from '../model/types'

type LocationState = CleaningJob

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

const progressFrom = (
  done: number,
  total: number,
  progressCopy: CleaningUiCopy['progress']
): CleaningProgress => {
  const safeTotal = Math.max(1, total)
  const percent = Math.round((done / safeTotal) * 100)
  return {
    total,
    done,
    percent: clamp(percent, 0, 100),
    statusText:
      done >= total ? progressCopy.statusDone : progressCopy.statusRunning,
  }
}

const downloadBlob = (blob: Blob, filename: string) => {
  // Official reference: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    a.click()
  } finally {
    try {
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }
}

const CleaningPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { locale } = useLocale()
  const copy = useMemo(() => getCleaningCopy(locale), [locale])
  const state = (location.state ?? null) as LocationState | null

  const photos = useMemo(() => state?.photos ?? [], [state])
  const total = photos.length

  const [progress, setProgress] = useState<CleaningProgress>(() =>
    progressFrom(0, total, copy.progress)
  )
  const [results, setResults] = useState<CleaningResultItem[] | null>(null)
  const [failedCount, setFailedCount] = useState(0)
  const cleaningRunIdRef = useRef(0)

  useEffect(() => {
    const runId = ++cleaningRunIdRef.current
    let cancelled = false

    const run = async () => {
      if (photos.length === 0) {
        if (runId !== cleaningRunIdRef.current) return
        setResults([])
        setProgress(progressFrom(0, 0, copy.progress))
        return
      }

      const out: CleaningResultItem[] = []
      let done = 0
      let failed = 0
      let historyWrites = 0
      const outputMime = exportFormatMime(getExportFormat())

      setResults(null)
      setFailedCount(0)
      setProgress(progressFrom(0, photos.length, copy.progress))

      for (const photo of photos) {
        if (cancelled || runId !== cleaningRunIdRef.current) return
        try {
          const meta = await extractPhotoMetadata(photo)
          if (cancelled || runId !== cleaningRunIdRef.current) return
          const { removed, lines, otherTagDetails } =
            await buildRemovalEvidence(photo.file, meta)
          if (cancelled || runId !== cleaningRunIdRef.current) return
          const cleaned = await stripImageMetadata(photo.file, {
            outputMime: outputMime,
          })
          if (cancelled || runId !== cleaningRunIdRef.current) return
          if (cleaned) {
            out.push(cleaned)
            try {
              await putCleanedRecord({
                id: crypto.randomUUID(),
                fileName: cleaned.name,
                createdAt: Date.now(),
                sizeBytes: cleaned.blob.size,
                imageAlt: photo.name,
                status: 'cleaned',
                removed,
                removedEvidenceLines: lines,
                otherTagDetails,
                outputMime: cleaned.type,
                blob: cleaned.blob,
              })
              historyWrites += 1
            } catch {
              /* IndexedDB unavailable — still offer download */
            }
          } else {
            failed += 1
          }
        } catch {
          failed += 1
        } finally {
          done += 1
          if (!cancelled && runId === cleaningRunIdRef.current) {
            setFailedCount(failed)
            setProgress(progressFrom(done, photos.length, copy.progress))
          }
        }
      }

      if (!cancelled && runId === cleaningRunIdRef.current) {
        setResults(out)
        if (historyWrites > 0) {
          dispatchHistoryUpdated()
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [photos, copy])

  const isDone = progress.done >= progress.total && results !== null
  const canSave = isDone && results.length > 0
  const canShare =
    canSave &&
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function'

  const circle = useMemo(() => {
    const r = 48
    const c = 2 * Math.PI * r
    const offset = c * (1 - progress.percent / 100)
    return { r, c, offset }
  }, [progress.percent])

  const headline = isDone ? copy.headlineDone : copy.headlineRunning
  const subline =
    progress.total > 0
      ? isDone
        ? copy.sublineDone(progress.total)
        : copy.sublineRunning(progress.total, progress.done)
      : copy.sublineNoPhotos

  return (
    <div className="bg-surface text-on-surface flex min-h-dvh flex-col">
      <TopBar
        left={
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:bg-surface-container-low flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
            aria-label={copy.backAria}
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
        }
      />

      <main className="success-gradient flex flex-1 flex-col items-center px-6 pt-32 pb-12">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="group relative mb-12">
            <div className="bg-primary/5 absolute inset-0 scale-150 rounded-full opacity-80 blur-3xl" />
            <div className="border-primary/10 absolute inset-0 scale-110 rounded-full border" />

            <div className="bg-surface-container-lowest relative flex size-36 items-center justify-center rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,80,203,0.1)]">
              {isDone ? (
                <ShieldCheck className="text-primary size-16" aria-hidden />
              ) : (
                <>
                  <svg className="absolute size-28 -rotate-90">
                    <circle
                      className="text-surface-container-high"
                      cx="56"
                      cy="56"
                      r={circle.r}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                    />
                    <circle
                      className="text-primary"
                      cx="56"
                      cy="56"
                      r={circle.r}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={circle.c}
                      strokeDashoffset={circle.offset}
                      strokeLinecap="round"
                    />
                  </svg>

                  <span className="text-primary text-3xl font-extrabold">
                    {progress.percent}%
                  </span>
                </>
              )}
            </div>

            <div className="border-outline-variant/10 absolute -top-4 -right-6 flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-md">
              {isDone ? (
                <Check className="text-primary size-4" aria-hidden />
              ) : (
                <LoaderCircle
                  className="text-primary size-4 animate-spin"
                  aria-hidden
                />
              )}
              <span className="text-primary text-[11px] font-extrabold tracking-widest uppercase">
                {isDone ? copy.badges.done : copy.badges.running}
              </span>
            </div>
          </div>

          <div className="mb-10 space-y-4 text-center">
            <h2 className="text-on-surface text-5xl leading-tight font-extrabold tracking-tight">
              {headline}
            </h2>
            <p className="text-on-surface-variant mx-auto max-w-[320px] text-lg leading-relaxed font-medium">
              {subline}
            </p>
            {failedCount > 0 ? (
              <p className="text-tertiary text-sm font-semibold">
                {copy.failedLine(failedCount)}
              </p>
            ) : null}
          </div>

          <div className="mb-12 grid w-full grid-cols-2 gap-4">
            <div className="border-outline-variant/5 bg-surface-container-low col-span-2 rounded-4xl border p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-on-surface-variant/60 text-[11px] font-bold tracking-wider uppercase">
                    {copy.statusCardLabel}
                  </span>
                  <p className="text-on-surface text-lg font-bold">
                    {isDone ? copy.statusDataDone : progress.statusText}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-2xl p-3">
                  <Check className="text-primary size-6" aria-hidden />
                </div>
              </div>
            </div>

            <div className="border-outline-variant/5 bg-surface-container-low rounded-[1.5rem] border p-5">
              <Upload
                className="text-tertiary-container/50 mb-3 size-6"
                aria-hidden
              />
              <p className="text-on-surface-variant/40 text-[10px] font-bold tracking-tighter uppercase">
                {copy.cardGpsLabel}
              </p>
              <p className="text-on-surface font-extrabold">
                {isDone ? copy.cardValueRemoved : copy.cardValueWaiting}
              </p>
            </div>

            <div className="border-outline-variant/5 bg-surface-container-low rounded-[1.5rem] border p-5">
              <Share2 className="text-secondary/50 mb-3 size-6" aria-hidden />
              <p className="text-on-surface-variant/40 text-[10px] font-bold tracking-tighter uppercase">
                {copy.cardDeviceLabel}
              </p>
              <p className="text-on-surface font-extrabold">
                {isDone ? copy.cardValueCleaned : copy.cardValuePending}
              </p>
            </div>
          </div>

          <div className="mt-auto w-full space-y-3">
            <GradientButton
              ariaLabel={copy.saveCta}
              disabled={!canSave}
              onClick={() => {
                if (!results) return
                for (const item of results) {
                  try {
                    downloadBlob(item.blob, item.name)
                  } catch {
                    // ignore
                  }
                }
              }}
              className={canSave ? '' : 'from-[#a1a1a1] to-[#bdbdbd]'}
            >
              {canSave ? copy.saveCta : copy.saveDisabled}
            </GradientButton>

            <button
              type="button"
              disabled={!canShare}
              onClick={async () => {
                if (!results || results.length === 0) return
                if (!canShare) return

                try {
                  const files = results.map(
                    r => new File([r.blob], r.name, { type: r.type })
                  )
                  await navigator.share({
                    title: copy.shareTitle,
                    text: copy.shareText,
                    files,
                  })
                } catch {
                  // ignore
                }
              }}
              className={[
                'w-full rounded-[1.5rem] py-5 text-lg font-bold transition-colors active:scale-[0.98]',
                canShare
                  ? 'bg-surface-container-high text-on-secondary-container hover:bg-surface-container-highest'
                  : 'bg-surface-container-high/50 text-on-secondary-container/40 cursor-not-allowed',
              ].join(' ')}
            >
              {copy.shareCta}
            </button>
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-20">
        <div className="bg-primary/10 absolute -top-20 -left-20 size-96 rounded-full blur-[100px]" />
        <div className="bg-secondary-container/20 absolute top-1/2 -right-40 size-80 rounded-full blur-[80px]" />
      </div>
    </div>
  )
}

export default CleaningPage
