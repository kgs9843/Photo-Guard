import { AlertTriangle } from 'lucide-react'
import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import {
  clearHistoryBlock,
  clearHistoryModal,
} from '@/pages/settings/model/settingsCopy'

type ClearHistoryConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

const ClearHistoryConfirmModal = ({
  open,
  onClose,
  onConfirm,
}: ClearHistoryConfirmModalProps) => {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  const handleConfirm = useCallback(() => {
    try {
      onConfirm()
    } catch {
      /* noop: parent handles feedback */
    }
  }, [onConfirm])

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    queueMicrotask(() => {
      panelRef.current?.focus({ preventScroll: true })
    })

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="bg-inverse-surface/40 fixed inset-0 z-60 flex items-center justify-center px-4 backdrop-blur-sm transition-opacity"
      role="presentation"
      onClick={() => {
        try {
          onClose()
        } catch {
          /* noop */
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="bg-surface-container-lowest relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,80,203,0.08)] outline-none"
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div className="bg-tertiary h-2 w-full shrink-0" aria-hidden />

        <div className="flex flex-col items-center px-6 pt-6 pb-8 text-center">
          <div
            className="bg-error-container mb-5 flex size-16 items-center justify-center rounded-full"
            aria-hidden
          >
            <AlertTriangle
              className="text-error size-8"
              strokeWidth={2}
              aria-hidden
            />
          </div>

          <h2
            id={titleId}
            className="text-on-surface mb-3 text-[1.5rem] font-semibold tracking-tight"
          >
            {clearHistoryBlock.title}
          </h2>
          <p
            id={descriptionId}
            className="text-on-surface-variant mb-8 px-2 text-[1rem] leading-relaxed"
          >
            {clearHistoryModal.body}
          </p>

          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              className="bg-tertiary text-on-tertiary w-full rounded-xl px-6 py-4 text-[1rem] font-bold shadow-sm transition-all duration-200 active:scale-[0.98]"
              onClick={handleConfirm}
            >
              {clearHistoryModal.delete}
            </button>
            <button
              type="button"
              className="bg-surface-container-high text-on-secondary-container w-full rounded-xl px-6 py-4 text-[1rem] font-semibold transition-all duration-200 active:scale-[0.98]"
              onClick={() => {
                try {
                  onClose()
                } catch {
                  /* noop */
                }
              }}
            >
              {clearHistoryModal.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ClearHistoryConfirmModal
