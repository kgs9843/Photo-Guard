import { ChevronRight, Globe, Ratio, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { dispatchHistoryUpdated } from '@/pages/history/model/historyEvents'
import { clearPhotoGuardLocalHistory } from '@/pages/settings/model/clearLocalHistory'
import {
  getExportFormat,
  setExportFormat,
} from '@/pages/settings/model/exportFormatStorage'
import type { ExportFormatKey } from '@/pages/settings/model/settingsCopy'
import { getSettingsCopy } from '@/pages/settings/model/settingsCopy'
import ClearHistoryConfirmModal from '@/pages/settings/ui/ClearHistoryConfirmModal'
import { useLocale } from '@/shared/lib/useLocale'
import Toast, { type ToastTone } from '@/shared/ui/Toast'

const APP_VERSION = '1.0.0'

type ToastState = { message: string; tone: ToastTone } | null

const SettingsPage = () => {
  const navigate = useNavigate()
  const { locale, setLocale } = useLocale()
  const copy = useMemo(() => getSettingsCopy(locale), [locale])
  const [format, setFormat] = useState<ExportFormatKey>(() => getExportFormat())
  const [clearHistoryModalOpen, setClearHistoryModalOpen] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = useCallback((message: string, tone: ToastTone) => {
    setToast({ message, tone })
  }, [])

  const runClearHistory = useCallback(async () => {
    try {
      const removed = await clearPhotoGuardLocalHistory()
      if (removed < 0) {
        showToast(copy.clearHistoryBlock.failed, 'error')
        return
      }
      if (removed === 0) {
        showToast(copy.clearHistoryBlock.empty, 'info')
        return
      }

      dispatchHistoryUpdated()
      showToast(copy.clearHistoryBlock.done, 'success')
    } catch {
      showToast(copy.clearHistoryBlock.failed, 'error')
    }
  }, [copy.clearHistoryBlock, showToast])

  const handleConfirmClearHistory = useCallback(() => {
    setClearHistoryModalOpen(false)
    void runClearHistory()
  }, [runClearHistory])

  return (
    <div className="space-y-8 pb-12">
      <Toast
        open={toast !== null}
        message={toast?.message ?? ''}
        tone={toast?.tone ?? 'info'}
        dismissAriaLabel={copy.toastDismissAria}
        onDismiss={() => {
          setToast(null)
        }}
      />
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
          {copy.settingsHero.title}
        </h2>
        <p className="text-on-surface-variant mt-1 text-sm leading-relaxed">
          {copy.settingsHero.subtitle}
        </p>
      </section>

      <div className="space-y-4">
        <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-surface-container-low text-on-surface-variant flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Globe className="size-5" aria-hidden strokeWidth={2} />
              </div>
              <div>
                <p className="text-on-surface font-bold">
                  {copy.languageBlock.title}
                </p>
                <p className="text-on-surface-variant text-xs">
                  {copy.languageBlock.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['ko', 'en'] as const).map(key => {
              const active = locale === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    try {
                      setLocale(key)
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
                  {copy.languageLabels[key]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-surface-container-low text-on-surface-variant flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Ratio className="size-5" aria-hidden strokeWidth={2} />
              </div>
              <div>
                <p className="text-on-surface font-bold">
                  {copy.exportFormatBlock.title}
                </p>
                <p className="text-on-surface-variant text-xs">
                  {copy.exportFormatBlock.description}
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
                  {copy.exportFormatLabels[key]}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          data-testid="settings-clear-history"
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
              <p className="text-error font-bold">
                {copy.clearHistoryBlock.title}
              </p>
              <p className="text-on-surface-variant text-xs">
                {copy.clearHistoryBlock.description}
              </p>
            </div>
          </div>
        </button>

        <h3 className="text-on-surface-variant px-2 pt-4 text-xs font-bold tracking-widest uppercase">
          {copy.settingsSections.appInfo}
        </h3>

        <div className="bg-surface-container-lowest mb-12 overflow-hidden rounded-[1.5rem] shadow-sm">
          <div className="flex items-center justify-between px-6 py-6">
            <span className="text-on-surface text-sm font-medium">
              {copy.appInfo.versionLabel}
            </span>
            <span className="text-primary text-sm font-bold">
              v{APP_VERSION} {copy.appInfo.latestVersionSuffix}
            </span>
          </div>
          <div className="bg-surface-variant mx-6 h-px opacity-50" />
          <button
            type="button"
            className="hover:bg-surface-container-low flex w-full cursor-pointer items-center justify-between px-6 py-6 text-left transition-colors"
            onClick={() => navigate('/privacy')}
          >
            <span className="text-on-surface text-sm font-medium">
              {copy.appInfo.terms}
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
              {copy.appInfo.licenses}
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
