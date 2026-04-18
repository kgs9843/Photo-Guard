export type SelectedPhoto = {
  file: File
  name: string
  sizeBytes: number
  type: string
  lastModified: number
  objectUrl: string
}

export type PhotoMetadata = {
  fileName: string
  fileType: string
  fileSizeBytes: number
  createdAt?: Date

  make?: string
  model?: string

  latitude?: number
  longitude?: number

  lensModel?: string
  focalLength?: number
  fNumber?: number
  exposureTime?: number
  iso?: number
}

export type CleanMetadataSummary = {
  totalCount: number
  riskLabel: string
  riskDescription: string
}

export type CleanMetadataItem = {
  id: string
  title: string
  description?: string
  severity?: 'warning' | 'neutral'
  kind: 'gps' | 'device' | 'datetime' | 'camera'
}

