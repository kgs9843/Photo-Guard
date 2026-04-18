import type { LucideIcon } from 'lucide-react'

export type PrivacyTip = {
  Icon: LucideIcon
  title: string
  body: string
}

export type HomeCopy = {
  homeHero: {
    title: string
    subtitle: string
  }
  homePrivacyHeading: string
  privacyTips: PrivacyTip[]
  /** 다중 선택 시 한 번에 처리할 수 있는 최대 장수 */
  photoSelection: {
    maxCount: number
    /** 선택 파일 수가 max를 넘을 때만 호출 */
    truncatedAlert: (selectedTotal: number) => string
  }
}

export type HomeLocale = 'ko' | 'en'
