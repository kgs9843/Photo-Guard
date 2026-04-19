import type { LucideIcon } from 'lucide-react'
import { Braces, CalendarDays, MapPinOff, Smartphone } from 'lucide-react'

import type { HistoryRecordRemovedMeta } from '@/pages/history/model/types'
import type { AppLocale } from '@/shared/model/appLocale'

export type RemovedMetaRowKind = 'gps' | 'device' | 'captureTime' | 'other'

export type RemovedMetaRowDef = {
  kind: RemovedMetaRowKind
  Icon: LucideIcon
  title: string
  /** null이면 `otherCount`로 판별 */
  removedFlag:
    | keyof Pick<HistoryRecordRemovedMeta, 'gps' | 'device' | 'captureTime'>
    | null
}

const titlesKo = {
  gps: 'GPS 위치 데이터',
  device: '기기 및 렌즈 정보',
  captureTime: '촬영 일시',
  other: '기타 기술 메타데이터',
} as const

const titlesEn = {
  gps: 'GPS location data',
  device: 'Device & lens info',
  captureTime: 'Capture timestamp',
  other: 'Other technical metadata',
} as const

export const getRemovedMetaRowDefs = (
  locale: AppLocale
): RemovedMetaRowDef[] => {
  const t = locale === 'en' ? titlesEn : titlesKo
  return [
    {
      kind: 'gps',
      Icon: MapPinOff,
      title: t.gps,
      removedFlag: 'gps',
    },
    {
      kind: 'device',
      Icon: Smartphone,
      title: t.device,
      removedFlag: 'device',
    },
    {
      kind: 'captureTime',
      Icon: CalendarDays,
      title: t.captureTime,
      removedFlag: 'captureTime',
    },
    {
      kind: 'other',
      Icon: Braces,
      title: t.other,
      removedFlag: null,
    },
  ]
}
