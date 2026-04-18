import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    } catch {
      try {
        window.scrollTo(0, 0)
      } catch {
        // ignore
      }
    }
  }, [pathname])

  return null
}

export default ScrollToTop

