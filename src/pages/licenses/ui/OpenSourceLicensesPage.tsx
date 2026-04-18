import { ArrowLeft } from 'lucide-react'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import TopBar from '@/app/layout/TopBar'
import {
  licenseEntries,
  licensesPageCopy,
} from '@/pages/licenses/model/licensesCopy'

const OpenSourceLicensesPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-surface text-on-surface min-h-dvh antialiased">
      <TopBar
        left={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-primary -ml-1 rounded-xl p-2 transition-opacity hover:opacity-80 active:scale-95"
            aria-label="뒤로"
          >
            <ArrowLeft className="size-6" aria-hidden strokeWidth={2} />
          </button>
        }
        title={
          <h1 className="text-on-surface max-w-full wrap-break-word font-['Manrope',sans-serif] text-base font-semibold tracking-tight text-pretty sm:text-lg">
            {licensesPageCopy.topBarTitle}
          </h1>
        }
        right={<span className="inline-block w-10 shrink-0" aria-hidden />}
      />

      <main className="mx-auto max-w-2xl space-y-6 px-6 pt-24 pb-12 md:px-6">
        <div className="px-2">
          <p className="text-on-surface-variant text-base leading-relaxed">
            {licensesPageCopy.intro}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {licenseEntries.map(entry => (
            <article
              key={entry.name}
              className="bg-surface-container-low hover:bg-surface-container flex flex-col gap-3 rounded-xl p-5 transition-colors duration-200"
            >
              <div className="flex w-full items-start justify-between gap-3">
                <h2 className="text-on-surface text-lg font-medium tracking-tight">
                  {entry.name}
                </h2>
                <span className="bg-surface-container-highest text-on-surface-variant shrink-0 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
                  {entry.licenseBadge}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed break-all">
                {entry.lines.map((line, i) => (
                  <Fragment key={`${entry.name}-${i}`}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </p>
            </article>
          ))}
        </div>

        <div className="h-12 shrink-0" aria-hidden />
      </main>
    </div>
  )
}

export default OpenSourceLicensesPage
