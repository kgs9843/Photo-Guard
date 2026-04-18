import { ArrowLeft, BadgeInfo, Clock, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import TopBar from '@/app/layout/TopBar'
import { privacyCopy } from '@/pages/privacy/model/privacyCopy'

const PrivacyPolicyPage = () => {
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
            {privacyCopy.topBarTitle}
          </h1>
        }
        right={<span className="inline-block w-10 shrink-0" aria-hidden />}
      />

      <main className="mx-auto max-w-4xl space-y-8 px-6 pt-24 pb-12 md:px-8">
        <div className="mb-10 space-y-4">
          <h2 className="text-on-surface text-2xl leading-tight font-bold tracking-tight md:text-4xl">
            {privacyCopy.heroTitle}
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            {privacyCopy.heroLead}
          </p>
        </div>

        <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
          <h3 className="text-on-surface mb-4 flex items-center gap-2 text-lg font-medium">
            <BadgeInfo
              className="text-primary size-6 shrink-0"
              aria-hidden
              strokeWidth={2}
            />
            {privacyCopy.collection.title}
          </h3>
          <div className="text-on-surface-variant space-y-3 leading-relaxed">
            <p>{privacyCopy.collection.lead}</p>
            <ul className="list-inside list-disc space-y-2 pl-2">
              {privacyCopy.collection.items.map(row => (
                <li key={row.label}>
                  <strong className="text-on-surface font-medium">
                    {row.label}
                  </strong>{' '}
                  {row.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
          <h3 className="text-on-surface mb-4 flex items-center gap-2 text-lg font-medium">
            <Target
              className="text-primary size-6 shrink-0"
              aria-hidden
              strokeWidth={2}
            />
            {privacyCopy.purpose.title}
          </h3>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            {privacyCopy.purpose.lead}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {privacyCopy.purpose.cards.map(card => (
              <div
                key={card.title}
                className="bg-surface-container-lowest rounded-lg p-4"
              >
                <h4 className="text-on-surface mb-2 font-medium">
                  {card.title}
                </h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
          <h3 className="text-on-surface mb-4 flex items-center gap-2 text-lg font-medium">
            <Clock
              className="text-primary size-6 shrink-0"
              aria-hidden
              strokeWidth={2}
            />
            {privacyCopy.retention.title}
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            {privacyCopy.retention.body}
          </p>
          <div className="bg-surface-container-lowest text-on-surface-variant mt-4 rounded-lg p-4 text-sm leading-relaxed">
            <p>{privacyCopy.retention.boxLines[0]}</p>
            <p className="text-primary mt-1 font-medium">
              {privacyCopy.retention.boxLines[1]}
            </p>
          </div>
        </section>

        <div className="text-on-surface-variant pt-8 text-center text-sm opacity-70">
          <p>{privacyCopy.effectiveDate}</p>
        </div>
      </main>
    </div>
  )
}

export default PrivacyPolicyPage
