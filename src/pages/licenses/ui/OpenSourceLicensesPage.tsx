import { ArrowLeft } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import TopBar from '@/app/layout/TopBar'
import {
  getLicensesPageCopy,
  licenseEntries,
} from '@/pages/licenses/model/licensesCopy'
import { getShellCopy } from '@/shared/lib/shellCopy'
import { useLocale } from '@/shared/lib/useLocale'

const OpenSourceLicensesPage = () => {
  const navigate = useNavigate()
  const { locale } = useLocale()
  const shell = useMemo(() => getShellCopy(locale), [locale])
  const page = useMemo(() => getLicensesPageCopy(locale), [locale])

  return (
    <div className="bg-surface text-on-surface min-h-dvh antialiased">
      <TopBar
        left={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-primary -ml-1 rounded-xl p-2 transition-opacity hover:opacity-80 active:scale-95"
            aria-label={shell.backAria}
          >
            <ArrowLeft className="size-6" aria-hidden strokeWidth={2} />
          </button>
        }
        title={
          <h1 className="text-on-surface max-w-full font-['Manrope',sans-serif] text-base font-semibold tracking-tight text-pretty wrap-break-word sm:text-lg">
            {page.topBarTitle}
          </h1>
        }
        right={<span className="inline-block w-10 shrink-0" aria-hidden />}
      />

      <main className="mx-auto max-w-2xl space-y-6 px-6 pt-24 pb-12 md:px-6">
        <div className="px-2">
          <p className="text-on-surface-variant text-base leading-relaxed">
            {page.intro}
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
                <span className="bg-primary-fixed/40 text-primary shrink-0 rounded-md px-2 py-0.5 text-xs font-bold">
                  {entry.licenseBadge}
                </span>
              </div>
              <div className="text-on-surface-variant font-mono text-xs leading-relaxed break-all">
                {entry.lines.map((line, i) => (
                  <Fragment key={`${entry.name}-${i}`}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default OpenSourceLicensesPage
