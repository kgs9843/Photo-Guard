import { RefreshCcw, Shield, WifiOff } from 'lucide-react'

import TopBar from '@/app/layout/TopBar'
import GradientButton from '@/shared/ui/GradientButton'

const OfflinePage = () => {
  return (
    <div className="bg-surface text-on-surface flex min-h-dvh flex-col antialiased">
      <TopBar
        left={
          <div className="flex items-center gap-3">
            <Shield className="text-primary size-6 shrink-0" aria-hidden />
            <h1 className="from-primary to-primary-container bg-linear-to-br bg-clip-text font-['Manrope',sans-serif] text-xl font-bold tracking-tight text-transparent">
              포토 가드
            </h1>
          </div>
        }
      />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pt-24 pb-12 text-center">
        <div className="relative mb-10 flex size-40 items-center justify-center">
          <div className="bg-surface-container-low absolute inset-0 rounded-full opacity-60" />
          <div className="bg-surface-container-highest relative flex size-28 items-center justify-center rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
            <WifiOff className="text-outline size-14 opacity-80" aria-hidden />
          </div>
          <div className="bg-tertiary-container border-surface absolute right-4 bottom-2 flex size-10 items-center justify-center rounded-full border-4 shadow-sm">
            <span className="text-on-tertiary-container text-sm font-extrabold">
              !
            </span>
          </div>
        </div>

        <div className="mb-12 w-full">
          <h2 className="text-on-surface mb-3 text-[1.5rem] font-bold tracking-tight">
            인터넷 연결을 확인해주세요
          </h2>
          <p className="text-on-surface-variant text-[1rem] leading-[1.6]">
            네트워크 연결이 원활하지 않아
            <br />
            정보를 불러올 수 없습니다.
          </p>
        </div>

        <GradientButton
          ariaLabel="Retry"
          onClick={() => {
            try {
              window.location.reload()
            } catch {
              // ignore
            }
          }}
          className="py-4 text-[1rem] shadow-[0_8px_20px_-4px_rgba(0,80,203,0.3)]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <RefreshCcw className="size-5" aria-hidden />
            다시 시도하기
          </span>
        </GradientButton>
      </main>
    </div>
  )
}

export default OfflinePage
