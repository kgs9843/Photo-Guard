import exifr from 'exifr'

import type { PhotoMetadata, SelectedPhoto } from './types'

type ExifrResult = {
  Make?: string
  Model?: string
  LensModel?: string
  FocalLength?: number
  FNumber?: number
  ExposureTime?: number
  ISO?: number
  DateTimeOriginal?: Date
  latitude?: number
  longitude?: number
}

const tags = [
  'Make',
  'Model',
  'LensModel',
  'FocalLength',
  'FNumber',
  'ExposureTime',
  'ISO',
  'DateTimeOriginal',
  'latitude',
  'longitude',
] as const

export const extractPhotoMetadata = async (
  photo: SelectedPhoto
): Promise<PhotoMetadata> => {
  try {
    const parsed = (await exifr.parse(
      photo.file,
      tags as unknown as string[]
    )) as ExifrResult | undefined | null

    return {
      fileName: photo.name,
      fileType: photo.type,
      fileSizeBytes: photo.sizeBytes,
      createdAt: parsed?.DateTimeOriginal,

      make: parsed?.Make,
      model: parsed?.Model,

      latitude: parsed?.latitude,
      longitude: parsed?.longitude,

      lensModel: parsed?.LensModel,
      focalLength: parsed?.FocalLength,
      fNumber: parsed?.FNumber,
      exposureTime: parsed?.ExposureTime,
      iso: parsed?.ISO,
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[extractPhotoMetadata]', photo.name, e)
    }
    return {
      fileName: photo.name,
      fileType: photo.type,
      fileSizeBytes: photo.sizeBytes,
    }
  }
}
