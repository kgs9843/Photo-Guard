import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export type ToastTone = 'success' | 'error' | 'info'

export type ToastProps = {
  open: boolean
  message: string
  tone?: ToastTone
  /** Auto-dismiss delay; set 0 to disable (still dismissible). */
  durationMs?: number
  dismissAriaLabel: string
  onDismiss: () => void
}

const toneIcon = (tone: ToastTone) => {
  switch (tone) {
    case 'success':
      return (
        <CheckCircle2
          className="text-primary size-5 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
      )
    case 'error':
      return (
        <XCircle
          className="text-error size-5 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
      )
    default:
      return (
        <Info
          className="text-on-surface-variant size-5 shrink-0"
          strokeWidth={2}
          aria-hidden
        />
      )
  }
}

const Toast = ({
  open,
  message,
  tone = 'info',
  durationMs,
  dismissAriaLabel,
  onDismiss,
}: ToastProps) => {
  const labelId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const resolvedDuration =
    durationMs !== undefined ? durationMs : tone === 'error' ? 6500 : 4200

  useEffect(() => {
    if (!open || resolvedDuration <= 0) return
    const t = window.setTimeout(() => {
      try {
        onDismiss()
      } catch {
        /* noop */
      }
    }, resolvedDuration)
    return () => window.clearTimeout(t)
  }, [open, resolvedDuration, onDismiss])

  useEffect(() => {
    if (!open) return
    queueMicrotask(() => closeRef.current?.focus({ preventScroll: true }))
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const live = tone === 'error' ? 'assertive' : 'polite'
  const role = tone === 'error' ? 'alert' : 'status'

  return createPortal(
    <div
      data-testid="app-toast"
      role={role}
      aria-live={live}
      aria-atomic="true"
      aria-labelledby={labelId}
      className="bg-surface-container-lowest/95 fixed right-4 left-4 z-[55] mx-auto max-w-lg rounded-[1.5rem] px-4 py-3 shadow-[0_10px_40px_rgba(0,80,203,0.12)] backdrop-blur-md sm:left-auto sm:w-full"
      style={{ bottom: 'max(6.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{toneIcon(tone)}</span>
        <p
          id={labelId}
          className="text-on-surface min-w-0 flex-1 pt-0.5 text-sm leading-snug font-medium"
        >
          {message}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => {
            try {
              onDismiss()
            } catch {
              /* noop */
            }
          }}
          className="text-on-surface-variant hover:bg-surface-container-high -mt-0.5 -mr-1 shrink-0 rounded-full p-1.5 transition-colors"
          aria-label={dismissAriaLabel}
        >
          <X className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>,
    document.body
  )
}

export default Toast
