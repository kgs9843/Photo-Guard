import type { ReactNode } from 'react'

type TopBarProps = {
  left?: ReactNode
  title?: ReactNode
  right?: ReactNode
}

const barBase =
  'bg-surface-container-lowest/80 fixed top-0 z-50 min-h-[68px] w-full items-center px-4 py-4 shadow-sm backdrop-blur-md sm:px-6'

const TopBar = ({ left, title, right }: TopBarProps) => {
  if (title) {
    return (
      <header
        className={`${barBase} grid grid-cols-[minmax(0,1fr)_minmax(0,2.25fr)_minmax(0,1fr)]`}
      >
        <div className="flex min-w-0 items-center justify-start gap-2 sm:gap-3">
          {left}
        </div>
        <div className="flex min-w-0 flex-col items-center justify-center px-1 text-center sm:px-2">
          <div className="max-w-full min-w-0 text-pretty wrap-break-word">
            {title}
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          {right}
        </div>
      </header>
    )
  }

  return (
    <header className={`${barBase} flex justify-between gap-4`}>
      <div className="flex min-w-0 flex-1 items-center justify-start gap-2 sm:gap-3">
        {left}
      </div>
      <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
        {right}
      </div>
    </header>
  )
}

export default TopBar
