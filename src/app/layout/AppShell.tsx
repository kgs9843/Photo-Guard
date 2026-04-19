import { ArrowLeft, History, Home, Settings } from 'lucide-react'
import { useMemo } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import TopBar from '@/app/layout/TopBar'
import { getShellCopy } from '@/shared/lib/shellCopy'
import { useLocale } from '@/shared/lib/useLocale'

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

const headerState = (
  pathname: string,
  shell: ReturnType<typeof getShellCopy>
): HeaderState => {
  if (HISTORY_DETAIL_PATH.test(pathname)) {
    return {
      text: shell.headerHistoryDetail,
      gradient: false,
      titlePrimary: false,
    }
  }
  if (pathname === '/settings') {
    return { text: shell.headerSettings, gradient: false, titlePrimary: false }
  }
  if (pathname === '/history') {
    return { text: shell.headerHistory, gradient: false, titlePrimary: false }
  }
  return { text: shell.headerPhotoGuard, gradient: true, titlePrimary: false }
}

const AppShell = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { locale } = useLocale()
  const shell = useMemo(() => getShellCopy(locale), [locale])
  const { text, gradient, titlePrimary } = headerState(pathname, shell)
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
              aria-label={shell.backAria}
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
                {shell.tabHome}
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
                {shell.tabHistory}
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
                {shell.tabSettings}
              </span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  )
}

export default AppShell
