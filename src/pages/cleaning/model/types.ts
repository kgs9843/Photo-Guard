import type { SelectedPhoto } from '@/pages/clean/model/types'

export type CleaningJob = {
  photos: SelectedPhoto[]
}

export type CleaningResultItem = {
  name: string
  type: string
  blob: Blob
}

export type CleaningProgress = {
  total: number
  done: number
  percent: number
  statusText: string
}
