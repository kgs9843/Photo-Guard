import type { CleaningResultItem } from './types'

/** 캔버스 JPEG 재인코딩 품질(0.95~0.98 권장 구간, 재압축 손실 완화) */
export const JPEG_REENCODE_QUALITY = 0.98

export type StripImageOptions = {
  outputMime?: 'image/jpeg' | 'image/png'
}

const readAsImageBitmap = async (file: File | Blob) => {
  // Official references:
  // - createImageBitmap: https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
  try {
    return await createImageBitmap(file)
  } catch {
    return null
  }
}

const canvasToBlob = async (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
) => {
  // Official references:
  // - HTMLCanvasElement.toBlob: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  return await new Promise<Blob | null>(resolve => {
    try {
      canvas.toBlob(blob => resolve(blob), type, quality)
    } catch {
      resolve(null)
    }
  })
}

const extensionForMime = (
  mime: 'image/jpeg' | 'image/png',
  baseName: string
) => {
  const ext = mime === 'image/jpeg' ? '.jpg' : '.png'
  const stripped = baseName.replace(/\.[^.]+$/, '')
  return `${stripped}${ext}`
}

export const reencodeBlobToMime = async (
  blob: Blob,
  mime: 'image/jpeg' | 'image/png',
  baseFileName: string,
  quality = JPEG_REENCODE_QUALITY
): Promise<CleaningResultItem | null> => {
  const bitmap = await readAsImageBitmap(blob)
  if (!bitmap) return null

  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return null
  }

  try {
    ctx.drawImage(bitmap, 0, 0)
  } catch {
    bitmap.close()
    return null
  } finally {
    bitmap.close()
  }

  const outBlob = await canvasToBlob(
    canvas,
    mime,
    mime === 'image/jpeg' ? quality : undefined
  )
  if (!outBlob) return null

  return {
    name: extensionForMime(mime, baseFileName),
    type: mime,
    blob: outBlob,
  }
}

export const stripImageMetadata = async (
  file: File,
  options?: StripImageOptions
): Promise<CleaningResultItem | null> => {
  const bitmap = await readAsImageBitmap(file)
  if (!bitmap) {
    return null
  }

  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return null
  }

  try {
    ctx.drawImage(bitmap, 0, 0)
  } catch {
    bitmap.close()
    return null
  } finally {
    bitmap.close()
  }

  const isJpeg = file.type === 'image/jpeg'
  const isPng = file.type === 'image/png'
  const outputType =
    options?.outputMime ??
    (isJpeg ? 'image/jpeg' : isPng ? 'image/png' : 'image/png')

  const blob = await canvasToBlob(
    canvas,
    outputType,
    outputType === 'image/jpeg' ? JPEG_REENCODE_QUALITY : undefined
  )
  if (!blob) {
    return null
  }

  const baseName = file.name.replace(/\.(heic|heif|avif|tif|tiff)$/i, '.png')
  const name = extensionForMime(
    outputType === 'image/jpeg' ? 'image/jpeg' : 'image/png',
    baseName
  )

  return { name, type: outputType, blob }
}
