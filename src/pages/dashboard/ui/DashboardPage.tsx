import { Camera } from 'lucide-react'
import { useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DEFAULT_HOME_LOCALE,
  getHomeCopy,
} from '@/pages/dashboard/model/homeCopy'

const DashboardPage = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const accept = useMemo(() => ['image/*'].join(','), [])

  const { homeHero, homePrivacyHeading, privacyTips, photoSelection } = useMemo(
    () => getHomeCopy(DEFAULT_HOME_LOCALE),
    []
  )

  const handleChoose = useCallback(() => {
    try {
      inputRef.current?.click()
    } catch {
      // ignore
    }
  }, [])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return
      }

      const fileArray = Array.from(files)
      const max = photoSelection.maxCount
      const limited =
        fileArray.length > max ? fileArray.slice(0, max) : fileArray

      if (fileArray.length > max) {
        try {
          window.alert(photoSelection.truncatedAlert(fileArray.length))
        } catch {
          // ignore
        }
      }

      const photos = limited.map(file => {
        const objectUrl = URL.createObjectURL(file)
        return {
          file,
          name: file.name,
          sizeBytes: file.size,
          type: file.type,
          lastModified: file.lastModified,
          objectUrl,
        }
      })

      try {
        navigate('/clean', { state: { photos } })
      } catch {
        for (const photo of photos) {
          try {
            URL.revokeObjectURL(photo.objectUrl)
          } catch {
            // ignore
          }
        }
      }
    },
    [navigate, photoSelection]
  )

  return (
    <div className="space-y-8">
      <section className="group relative">
        <div className="from-primary to-primary-container absolute -inset-1 rounded-4xl bg-linear-to-r opacity-15 blur transition duration-1000 group-hover:opacity-25 group-hover:duration-200" />
        <button
          type="button"
          onClick={handleChoose}
          className="from-primary to-primary-container relative flex w-full flex-col items-center justify-center overflow-hidden rounded-4xl bg-linear-to-br p-8 text-center shadow-xl transition duration-150 active:scale-[0.98]"
        >
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept={accept}
            multiple
            onChange={e => {
              handleFiles(e.currentTarget.files)
              e.currentTarget.value = ''
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/cubes.png')",
            }}
          />
          <div className="relative mb-2 flex size-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <Camera
              className="size-10 text-white"
              aria-hidden
              strokeWidth={1.75}
            />
          </div>
          <div className="relative space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              {homeHero.title}
            </h2>
            <p className="text-sm text-white/80">{homeHero.subtitle}</p>
          </div>
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-on-surface text-xl font-bold tracking-tight">
            {homePrivacyHeading}
          </h3>
        </div>
        <div className="space-y-3 pb-8">
          {privacyTips.map(({ Icon, title, body }, index) => (
            <div
              key={`privacy-tip-${index}`}
              className="bg-surface-container-low active:bg-surface-container-high flex items-center gap-4 rounded-xl p-4 transition-colors"
            >
              <div className="bg-primary-fixed/50 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                <Icon className="size-5" aria-hidden strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-on-surface text-sm font-bold">{title}</h4>
                <p className="text-on-surface-variant text-xs">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
