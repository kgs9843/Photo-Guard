import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import OfflinePage from '@/pages/offline'

type OnlineBoundaryProps = {
  children: ReactNode
}

const OnlineBoundary = ({ children }: OnlineBoundaryProps) => {
  const [isOnline, setIsOnline] = useState(() => {
    try {
      return navigator.onLine
    } catch {
      return true
    }
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    try {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    } catch {
      // ignore
    }

    return () => {
      try {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      } catch {
        // ignore
      }
    }
  }, [])

  if (!isOnline) {
    return <OfflinePage />
  }

  return <>{children}</>
}

export default OnlineBoundary
