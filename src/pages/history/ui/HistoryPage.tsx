import { ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAllCleanedRecords } from '@/pages/history/model/cleanedHistoryDb'
import { HISTORY_UPDATED_EVENT } from '@/pages/history/model/historyEvents'
import {
  cleanedBadgeLabel,
  historySectionCopy,
} from '@/pages/history/model/historyMock'
import { cleanedStoredToHistoryRecord } from '@/pages/history/model/historyRecordsUi'
import type { HistoryRecord } from '@/pages/history/model/types'

const HistoryPage = () => {
  const navigate = useNavigate()
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [ready, setReady] = useState(false)
  const objectUrlsRef = useRef<string[]>([])

  const revokeObjectUrls = useCallback(() => {
    for (const url of objectUrlsRef.current) {
      try {
        URL.revokeObjectURL(url)
      } catch {
        /* ignore */
      }
    }
    objectUrlsRef.current = []
  }, [])

  const load = useCallback(async () => {
    try {
      const rows = await getAllCleanedRecords()
      revokeObjectUrls()
      const next: HistoryRecord[] = []
      for (const row of rows) {
        const url = URL.createObjectURL(row.blob)
        objectUrlsRef.current.push(url)
        next.push(cleanedStoredToHistoryRecord(row, url))
      }
      setRecords(next)
    } catch {
      revokeObjectUrls()
      setRecords([])
    } finally {
      setReady(true)
    }
  }, [revokeObjectUrls])

  useEffect(() => {
    void load()
    const onUpdated = () => {
      void load()
    }
    window.addEventListener(HISTORY_UPDATED_EVENT, onUpdated)
    return () => {
      window.removeEventListener(HISTORY_UPDATED_EVENT, onUpdated)
      revokeObjectUrls()
    }
  }, [load, revokeObjectUrls])

  const empty = ready && records.length === 0
  const hasRows = ready && records.length > 0

  return (
    <div className="space-y-8 pb-8">
      <section>
        <h2 className="text-on-surface mb-2 text-2xl font-bold tracking-tight">
          {historySectionCopy.title}
        </h2>
        <p className="text-on-surface-variant text-base leading-relaxed">
          {historySectionCopy.description}
        </p>
      </section>

      {empty ? (
        <div className="border-outline-variant/10 bg-surface-container-lowest rounded-xl border p-8 text-center shadow-sm">
          <p className="text-on-surface mb-2 font-bold">
            {historySectionCopy.emptyTitle}
          </p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {historySectionCopy.emptyBody}
          </p>
        </div>
      ) : null}

      {hasRows ? (
        <div className="space-y-4">
          {records.map(record => (
            <button
              key={record.id}
              type="button"
              onClick={() => navigate(`/history/${record.id}`)}
              className="group bg-surface-container-lowest hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-4 rounded-xl p-4 text-left shadow-sm transition-all active:scale-[0.99]"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                <img
                  src={record.imageSrc}
                  alt={record.imageAlt}
                  className="size-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-on-surface truncate font-bold">
                  {record.fileName}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-on-surface-variant text-sm">
                    {record.dateLabel}
                  </span>
                  <span
                    className="bg-outline-variant size-1 shrink-0 rounded-full"
                    aria-hidden
                  />
                  <span className="text-on-surface-variant text-sm">
                    {record.sizeLabel}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="bg-primary-fixed text-primary rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
                  {record.status === 'cleaned'
                    ? cleanedBadgeLabel
                    : record.status}
                </span>
                <ChevronRight
                  className="text-outline-variant group-hover:text-primary size-5 transition-colors"
                  aria-hidden
                  strokeWidth={2}
                />
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default HistoryPage
