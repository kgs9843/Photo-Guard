export type HistoryRecordStatus = 'cleaned'

/** EXIF 등에서 분리한 ‘기타’ 태그 한 줄(상세 화면용) */
export type OtherMetaTagDetail = {
  key: string
  valuePreview: string
}

/** 정제 후 상세 화면에서 “제거됨”으로 표시할 스냅샷 */
export type HistoryRecordRemovedMeta = {
  gps: boolean
  device: boolean
  captureTime: boolean
  /** 0이면 ‘기타 기술 메타데이터’ 카드는 숨김 */
  otherCount: number
}

/** IndexedDB에 저장되는 정제 기록(이미지 blob 포함) */
export type CleanedHistoryRecordStored = {
  id: string
  fileName: string
  createdAt: number
  sizeBytes: number
  imageAlt: string
  status: HistoryRecordStatus
  removed: HistoryRecordRemovedMeta
  /** 정제 전 탐지된 항목 요약(상세 화면) */
  removedEvidenceLines: string[]
  /** 기타 태그 상세(구버전 기록에는 없을 수 있음) */
  otherTagDetails?: OtherMetaTagDetail[]
  outputMime: string
  blob: Blob
}

/** 목록·라우팅용(이미지는 object URL로 연결) */
export type HistoryRecord = {
  id: string
  fileName: string
  dateLabel: string
  sizeLabel: string
  imageSrc: string
  imageAlt: string
  status: HistoryRecordStatus
  removed: HistoryRecordRemovedMeta
  removedEvidenceLines: string[]
  otherTagDetails?: OtherMetaTagDetail[]
  outputMime: string
}
