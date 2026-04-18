import type { LucideIcon } from 'lucide-react'
import { Braces, CalendarDays, MapPinOff, Smartphone } from 'lucide-react'

import type { HistoryRecordRemovedMeta } from '@/pages/history/model/types'

export type RemovedMetaRowKind = 'gps' | 'device' | 'captureTime' | 'other'

export type RemovedMetaRowDef = {
  kind: RemovedMetaRowKind
  Icon: LucideIcon
  title: string
  /** null이면 `otherCount`로 판별 */
  removedFlag: keyof Pick<
    HistoryRecordRemovedMeta,
    'gps' | 'device' | 'captureTime'
  > | null
}

export const removedMetaRowDefs: RemovedMetaRowDef[] = [
  {
    kind: 'gps',
    Icon: MapPinOff,
    title: 'GPS 위치 데이터',
    removedFlag: 'gps',
  },
  {
    kind: 'device',
    Icon: Smartphone,
    title: '기기 및 렌즈 정보',
    removedFlag: 'device',
  },
  {
    kind: 'captureTime',
    Icon: CalendarDays,
    title: '촬영 일시',
    removedFlag: 'captureTime',
  },
  {
    kind: 'other',
    Icon: Braces,
    title: '기타 기술 메타데이터',
    removedFlag: null,
  },
]
