import { ChevronRight, Ratio, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { dispatchHistoryUpdated } from '@/pages/history/model/historyEvents'
import { clearPhotoGuardLocalHistory } from '@/pages/settings/model/clearLocalHistory'
import {
  getExportFormat,
  setExportFormat,
} from '@/pages/settings/model/exportFormatStorage'
import {
  appInfo,
  clearHistoryBlock,
  exportFormatBlock,
  type ExportFormatKey,
  exportFormatLabels,
  settingsHero,
  settingsSections,
} from '@/pages/settings/model/settingsCopy'
import ClearHistoryConfirmModal from '@/pages/settings/ui/ClearHistoryConfirmModal'

const APP_VERSION = '1.0.0'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [format, setFormat] = useState<ExportFormatKey>(() => getExportFormat())
  const [clearHistoryModalOpen, setClearHistoryModalOpen] = useState(false)

  const runClearHistory = useCallback(async () => {
    try {
      const removed = await clearPhotoGuardLocalHistory()
      if (removed < 0) {
        window.alert(clearHistoryBlock.failed)
        return
      }
      if (removed === 0) {
        window.alert(clearHistoryBlock.empty)
        return
      }

      dispatchHistoryUpdated()
      window.alert(clearHistoryBlock.done)
    } catch {
      window.alert(clearHistoryBlock.failed)
    }
  }, [])

  const handleConfirmClearHistory = useCallback(() => {
    setClearHistoryModalOpen(false)
    runClearHistory()
  }, [runClearHistory])

  return (
    <div className="space-y-8 pb-12">
      <ClearHistoryConfirmModal
        open={clearHistoryModalOpen}
        onClose={() => {
          setClearHistoryModalOpen(false)
        }}
        onConfirm={handleConfirmClearHistory}
      />

      <section className="py-6 text-center">
        <div className="from-primary to-primary-container mb-4 inline-flex rounded-4xl bg-linear-to-br p-4 shadow-lg">
          <img
            src="/logo-white.svg"
            alt=""
            width={33}
            height={40}
            className="h-12 w-12 shrink-0 object-contain"
            decoding="async"
          />
        </div>
        <h2 className="text-on-surface text-2xl font-bold tracking-tight">
          {settingsHero.title}
        </h2>
        <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">
          {settingsHero.subtitle}
        </p>
      </section>

      <div className="space-y-4">
        <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-surface-container-low text-on-surface-variant flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Ratio className="size-5" aria-hidden strokeWidth={2} />
              </div>
              <div>
                <p className="text-on-surface font-bold">
                  {exportFormatBlock.title}
                </p>
                <p className="text-on-surface-variant text-xs">
                  {exportFormatBlock.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['jpg', 'png'] as const).map(key => {
              const active = format === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    try {
                      setFormat(key)
                      setExportFormat(key)
                    } catch {
                      /* noop */
                    }
                  }}
                  className={
                    active
                      ? 'bg-primary text-on-primary rounded-full px-4 py-1.5 text-xs font-bold'
                      : 'bg-surface-container-high text-on-surface-variant rounded-full px-4 py-1.5 text-xs font-bold'
                  }
                >
                  {exportFormatLabels[key]}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setClearHistoryModalOpen(true)
          }}
          className="bg-surface-container-lowest hover:bg-surface-container-low focus-visible:ring-primary/40 w-full cursor-pointer rounded-[1.5rem] p-6 text-left shadow-sm transition-colors outline-none focus-visible:ring-2"
        >
          <div className="flex items-center gap-4">
            <div className="bg-error-container text-on-error-container flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Trash2 className="size-5" aria-hidden strokeWidth={2} />
            </div>
            <div>
              <p className="text-error font-bold">{clearHistoryBlock.title}</p>
              <p className="text-on-surface-variant text-xs">
                {clearHistoryBlock.description}
              </p>
            </div>
          </div>
        </button>

        <h3 className="text-on-surface-variant px-2 pt-4 text-xs font-bold tracking-widest uppercase">
          {settingsSections.appInfo}
        </h3>

        <div className="bg-surface-container-lowest mb-12 overflow-hidden rounded-[1.5rem] shadow-sm">
          <div className="flex items-center justify-between px-6 py-6">
            <span className="text-on-surface text-sm font-medium">
              {appInfo.versionLabel}
            </span>
            <span className="text-primary text-sm font-bold">
              v{APP_VERSION} {appInfo.latestVersionSuffix}
            </span>
          </div>
          <div className="bg-surface-variant mx-6 h-px opacity-50" />
          <button
            type="button"
            className="hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between px-6 py-6 text-left transition-colors"
            onClick={() => navigate('/privacy')}
          >
            <span className="text-on-surface text-sm font-medium">
              {appInfo.terms}
            </span>
            <ChevronRight
              className="text-on-surface-variant size-5 shrink-0"
              aria-hidden
              strokeWidth={2}
            />
          </button>
          <div className="bg-surface-variant mx-6 h-px opacity-50" />
          <button
            type="button"
            className="hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between px-6 py-6 text-left transition-colors"
            onClick={() => navigate('/licenses')}
          >
            <span className="text-on-surface text-sm font-medium">
              {appInfo.licenses}
            </span>
            <ChevronRight
              className="text-on-surface-variant size-5 shrink-0"
              aria-hidden
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
