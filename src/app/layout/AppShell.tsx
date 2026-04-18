import { ArrowLeft, History, Home, Settings } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import TopBar from '@/app/layout/TopBar'

const HISTORY_DETAIL_PATH = /^\/history\/[^/]+$/

const tabClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex flex-col items-center justify-center rounded-[1.5rem] px-6 py-2 transition-transform duration-150 active:scale-[0.98]',
    isActive
      ? 'bg-primary-fixed/60 text-primary'
      : 'text-on-surface-variant hover:bg-primary-fixed/25',
  ].join(' ')

type HeaderState = {
  text: string
  gradient: boolean
  titlePrimary: boolean
}

const headerState = (pathname: string): HeaderState => {
  if (HISTORY_DETAIL_PATH.test(pathname)) {
    return { text: '보호된 사진 정보', gradient: false, titlePrimary: false }
  }
  if (pathname === '/settings') {
    return { text: '설정', gradient: false, titlePrimary: false }
  }
  if (pathname === '/history') {
    return { text: '기록', gradient: false, titlePrimary: false }
  }
  return { text: 'Photo Guard', gradient: true, titlePrimary: false }
}

const AppShell = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { text, gradient, titlePrimary } = headerState(pathname)
  const isHistoryDetail = HISTORY_DETAIL_PATH.test(pathname)

  return (
    <div className="bg-surface text-on-surface min-h-dvh pb-28">
      <TopBar
        left={
          isHistoryDetail ? (
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="text-primary hover:bg-surface-container-low -ml-1 rounded-full p-2 transition-colors active:scale-95"
              aria-label="뒤로"
            >
              <ArrowLeft className="size-6" aria-hidden strokeWidth={2} />
            </button>
          ) : (
            <img
              src="/logo.svg"
              alt=""
              width={33}
              height={40}
              className="h-8 w-auto shrink-0 object-contain"
              decoding="async"
            />
          )
        }
        title={
          <h1
            className={
              titlePrimary
                ? "text-primary font-['Manrope',sans-serif] text-lg font-bold tracking-tight"
                : gradient
                  ? "from-primary to-primary-container bg-linear-to-br bg-clip-text font-['Manrope',sans-serif] text-xl font-bold tracking-tight text-transparent"
                  : "text-on-surface font-['Manrope',sans-serif] text-lg font-semibold tracking-tight"
            }
          >
            {text}
          </h1>
        }
        right={
          isHistoryDetail ? (
            <span className="inline-block w-10 shrink-0" aria-hidden />
          ) : undefined
        }
      />

      <main className="mx-auto max-w-2xl space-y-8 px-6 pt-24">
        <Outlet />
      </main>

      <nav className="bg-surface-container-lowest fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-4xl px-4 pt-3 pb-8 shadow-[0_-4px_20px_rgba(0,80,203,0.06)]">
        <NavLink to="/" end className={tabClass}>
          {({ isActive }) => (
            <>
              <Home
                className={`mb-1 size-6 ${isActive ? 'text-primary' : ''}`}
                aria-hidden
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="font-['Manrope',sans-serif] text-[12px] font-bold">
                홈
              </span>
            </>
          )}
        </NavLink>
        <NavLink to="/history" className={tabClass}>
          {({ isActive }) => (
            <>
              <History
                className={`mb-1 size-6 ${isActive ? 'text-primary' : ''}`}
                aria-hidden
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="font-['Manrope',sans-serif] text-[12px] font-bold">
                기록
              </span>
            </>
          )}
        </NavLink>
        <NavLink to="/settings" className={tabClass}>
          {({ isActive }) => (
            <>
              <Settings
                className={`mb-1 size-6 ${isActive ? 'text-primary' : ''}`}
                aria-hidden
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="font-['Manrope',sans-serif] text-[12px] font-bold">
                설정
              </span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  )
}

export default AppShell
