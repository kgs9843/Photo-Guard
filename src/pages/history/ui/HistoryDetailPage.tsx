import { ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { reencodeBlobToMime } from '@/pages/cleaning/model/stripMetadata'
import { getCleanedRecordById } from '@/pages/history/model/cleanedHistoryDb'
import { historyDetailCopy } from '@/pages/history/model/historyDetailCopy'
import { cleanedStoredToHistoryRecord } from '@/pages/history/model/historyRecordsUi'
import {
  removedMetaRowDefs,
  type RemovedMetaRowKind,
} from '@/pages/history/model/historyRemovedMetaRows'
import type { HistoryRecord } from '@/pages/history/model/types'
import {
  exportFormatMime,
  getExportFormat,
} from '@/pages/settings/model/exportFormatStorage'
import GradientButton from '@/shared/ui/GradientButton'

const downloadBlob = (blob: Blob, filename: string) => {
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
      /* ignore */
    }
  }
}

const HistoryDetailPage = () => {
  const { recordId } = useParams<{ recordId: string }>()
  const navigate = useNavigate()

  const [record, setRecord] = useState<HistoryRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const sourceBlobRef = useRef<Blob | null>(null)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const rid = recordId ?? ''

    setLoading(true)
    setRecord(null)
    sourceBlobRef.current = null
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current)
      } catch {
        /* ignore */
      }
      previewUrlRef.current = null
    }

    if (!rid) {
      setLoading(false)
      return
    }

    void (async () => {
      try {
        const row = await getCleanedRecordById(rid)
        if (cancelled) return
        if (!row) {
          setRecord(null)
          return
        }
        sourceBlobRef.current = row.blob
        const url = URL.createObjectURL(row.blob)
        previewUrlRef.current = url
        setRecord(cleanedStoredToHistoryRecord(row, url))
      } catch {
        if (!cancelled) setRecord(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current)
        } catch {
          /* ignore */
        }
        previewUrlRef.current = null
      }
    }
  }, [recordId])

  const handleSaveToGallery = useCallback(async () => {
    const blob = sourceBlobRef.current
    if (!blob || !record) return
    try {
      const format = getExportFormat()
      const mime = exportFormatMime(format)
      const out = await reencodeBlobToMime(blob, mime, record.fileName)
      if (!out) {
        window.alert(historyDetailCopy.saveFailed)
        return
      }
      downloadBlob(out.blob, out.name)
    } catch {
      window.alert(historyDetailCopy.saveFailed)
    }
  }, [record])

  const handleShare = useCallback(async () => {
    if (!record) return
    if (
      typeof navigator === 'undefined' ||
      typeof navigator.share !== 'function'
    ) {
      window.alert(historyDetailCopy.shareUnsupported)
      return
    }
    try {
      const blob = sourceBlobRef.current
      if (blob) {
        const file = new File([blob], record.fileName, {
          type: blob.type || record.outputMime || 'image/jpeg',
        })
        const filesPayload = { files: [file] }
        if (navigator.canShare?.(filesPayload)) {
          await navigator.share({ ...filesPayload, title: record.fileName })
          return
        }
      }

      await navigator.share({
        title: record.fileName,
        text: historyDetailCopy.statusBody,
        url: record.imageSrc,
      })
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return
      window.alert(historyDetailCopy.shareFailed)
    }
  }, [record])

  const visibleRows = useMemo(() => {
    if (!record) return []
    return removedMetaRowDefs.filter(def => {
      if (def.removedFlag) {
        return record.removed[def.removedFlag]
      }
      return record.removed.otherCount > 0
    })
  }, [record])

  const rowBadge = (kind: RemovedMetaRowKind): string => {
    if (!record) return ''
    if (kind === 'other') {
      return historyDetailCopy.badgeOther(record.removed.otherCount)
    }
    return historyDetailCopy.badgeCleared
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <p className="text-on-surface-variant text-base leading-relaxed">
          불러오는 중…
        </p>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="space-y-6 pb-12">
        <p className="text-on-surface-variant text-base leading-relaxed">
          {historyDetailCopy.notFoundTitle}
        </p>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="text-primary text-sm font-bold underline-offset-4 hover:underline"
        >
          {historyDetailCopy.notFoundCta}
        </button>
      </div>
    )
  }

  const evidenceLines = record.removedEvidenceLines

  return (
    <div className="flex flex-col gap-6 pb-10">
      <section className="bg-surface-container-low w-full overflow-hidden rounded-xl shadow-sm">
        <div className="bg-surface-container-high relative aspect-4/3 w-full">
          <img
            src={record.imageSrc}
            alt={record.imageAlt}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="border-outline-variant/10 text-on-surface-variant flex flex-wrap items-center gap-x-2 gap-y-1 border-t px-4 py-3 text-xs">
          <span className="text-on-surface font-semibold">
            {record.fileName}
          </span>
          <span className="text-outline-variant" aria-hidden>
            ·
          </span>
          <span>{record.dateLabel}</span>
          <span className="text-outline-variant" aria-hidden>
            ·
          </span>
          <span>{record.sizeLabel}</span>
        </div>
      </section>

      <section className="border-outline-variant/10 bg-surface-container-lowest flex flex-col items-center gap-3 rounded-xl border p-6 text-center shadow-[0_8px_30px_rgb(0,80,203,0.04)]">
        <div className="from-primary to-primary-container mb-2 flex size-16 items-center justify-center rounded-full bg-linear-to-br shadow-[0_4px_16px_rgb(0,102,255,0.3)]">
          <ShieldCheck
            className="size-8 text-white"
            aria-hidden
            strokeWidth={2}
          />
        </div>
        <h2 className="text-on-surface text-2xl font-bold tracking-tight">
          {historyDetailCopy.statusTitle}
        </h2>
        <p className="text-on-surface-variant max-w-md text-base leading-relaxed">
          {historyDetailCopy.statusBody}
        </p>
      </section>

      {evidenceLines.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h3 className="text-on-surface px-1 text-lg font-medium tracking-tight">
            {historyDetailCopy.sectionEvidenceHeading}
          </h3>
          <ul className="border-outline-variant/10 bg-surface-container-lowest space-y-2 rounded-xl border p-4 shadow-sm">
            {evidenceLines.map((line, i) => (
              <li
                key={`${i}-${line.slice(0, 24)}`}
                className="text-on-surface-variant text-sm leading-relaxed"
              >
                {line}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <h3 className="text-on-surface px-1 text-lg font-medium tracking-tight">
          {historyDetailCopy.sectionRemovedHeading}
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {visibleRows.map(def => {
            const RowIcon = def.Icon
            return (
              <div
                key={def.kind}
                className="border-outline-variant/10 bg-surface-container-lowest hover:bg-surface-container-low/50 flex items-start gap-4 rounded-xl border p-4 shadow-sm transition-colors"
              >
                <div className="text-primary mt-0.5 shrink-0">
                  <RowIcon className="size-5" aria-hidden strokeWidth={2} />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-on-surface text-sm font-semibold tracking-tight">
                    {def.title}
                  </span>
                  <span className="bg-primary-fixed/30 text-primary-container mt-1 inline-block w-fit rounded-md px-2 py-0.5 text-xs font-bold">
                    {rowBadge(def.kind)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {record.removed.otherCount > 0 ? (
          <div className="border-outline-variant/10 bg-surface-container-lowest mt-1 rounded-xl border p-4 shadow-sm">
            <h4 className="text-on-surface text-sm font-semibold tracking-tight">
              {historyDetailCopy.sectionOtherTagsHeading}
            </h4>
            {record.otherTagDetails && record.otherTagDetails.length > 0 ? (
              <>
                {record.removed.otherCount > record.otherTagDetails.length ? (
                  <p className="text-on-surface-variant mt-2 text-xs leading-relaxed">
                    전체 {record.removed.otherCount}개 중 상위{' '}
                    {record.otherTagDetails.length}개만 표시합니다.
                  </p>
                ) : null}
                <dl className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                  {record.otherTagDetails.map(row => (
                    <div
                      key={row.key}
                      className="border-outline-variant/10 grid gap-1 border-b border-dotted pb-3 last:border-0 last:pb-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] sm:gap-x-4"
                    >
                      <dt className="text-on-surface font-mono text-xs font-semibold break-all">
                        {row.key}
                      </dt>
                      <dd className="text-on-surface-variant text-xs leading-relaxed wrap-break-word">
                        {row.valuePreview}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="text-on-surface-variant mt-3 text-sm leading-relaxed">
                {historyDetailCopy.otherTagsLegacyHint}
              </p>
            )}
          </div>
        ) : null}
      </section>

      <section className="mt-2 flex w-full flex-col gap-3">
        <GradientButton
          ariaLabel={historyDetailCopy.saveToGallery}
          onClick={() => {
            void handleSaveToGallery()
          }}
          className="shadow-primary/25 shadow-xl"
        >
          {historyDetailCopy.saveToGallery}
        </GradientButton>
        <button
          type="button"
          onClick={() => {
            void handleShare()
          }}
          className="bg-surface-container-high text-on-secondary-container hover:bg-surface-container-highest flex w-full items-center justify-center gap-2 rounded-[1.5rem] py-5 text-lg font-bold transition-all duration-200 active:scale-[0.95]"
        >
          {historyDetailCopy.share}
        </button>
      </section>
    </div>
  )
}

export default HistoryDetailPage
