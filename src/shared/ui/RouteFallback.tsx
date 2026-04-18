import { LoaderCircle } from 'lucide-react'

const RouteFallback = () => {
  return (
    <div className="bg-surface text-on-surface flex min-h-dvh items-center justify-center px-6">
      <div className="bg-surface-container-lowest flex w-full max-w-sm items-center gap-4 rounded-4xl p-6 shadow-sm">
        <div className="bg-primary-fixed/60 text-primary flex size-12 items-center justify-center rounded-2xl">
          <LoaderCircle className="size-6 animate-spin" aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="text-on-surface text-sm font-bold">로딩 중…</div>
          <div className="text-on-surface-variant mt-1 text-xs leading-relaxed">
            화면을 준비하고 있습니다.
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteFallback
