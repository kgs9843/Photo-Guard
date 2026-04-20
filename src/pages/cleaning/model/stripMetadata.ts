import type { CleaningResultItem } from './types'

/** 캔버스 JPEG 재인코딩 품질(0.95~0.98 권장 구간, 재압축 손실 완화) */
export const JPEG_REENCODE_QUALITY = 0.98

/**
 * 디코딩·캔버스 한 변 최대 길이(px). 초과 시 재인코딩 단계에서 비율을 유지한 채 축소 디코딩합니다.
 * @see README.md 정제 방식
 */
export const MAX_IMAGE_DECODE_EDGE_PX = 8192

export type StripFailureCode = 'decode_failed' | 'draw_failed' | 'encode_failed'

export type StripOutcome =
  | { ok: true; item: CleaningResultItem }
  | { ok: false; code: StripFailureCode }

export type StripImageOptions = {
  outputMime?: 'image/jpeg' | 'image/png'
}

/** 첫 디코드가 너무 크면 OOM을 피하기 위해 비율 유지 축소 디코딩을 시도합니다. */
const rescaleDecodeImageBitmap = async (
  file: File | Blob,
  width: number,
  height: number
): Promise<ImageBitmap | null> => {
  try {
    if (width >= height) {
      return await createImageBitmap(file, {
        resizeWidth: MAX_IMAGE_DECODE_EDGE_PX,
      })
    }
    return await createImageBitmap(file, {
      resizeHeight: MAX_IMAGE_DECODE_EDGE_PX,
    })
  } catch {
    return null
  }
}

const readBitmapForStrip = async (
  file: File | Blob
): Promise<ImageBitmap | null> => {
  try {
    const bitmap = await createImageBitmap(file)
    const w = bitmap.width
    const h = bitmap.height
    if (w <= MAX_IMAGE_DECODE_EDGE_PX && h <= MAX_IMAGE_DECODE_EDGE_PX) {
      return bitmap
    }
    bitmap.close()
    return await rescaleDecodeImageBitmap(file, w, h)
  } catch {
    try {
      return await createImageBitmap(file, {
        resizeWidth: MAX_IMAGE_DECODE_EDGE_PX,
      })
    } catch {
      try {
        return await createImageBitmap(file, {
          resizeHeight: MAX_IMAGE_DECODE_EDGE_PX,
        })
      } catch {
        return null
      }
    }
  }
}

const canvasToBlob = async (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
) => {
  // Official reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
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

const bitmapToResult = async (
  bitmap: ImageBitmap,
  outputType: 'image/jpeg' | 'image/png',
  baseName: string
): Promise<StripOutcome> => {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return { ok: false, code: 'draw_failed' }
  }

  try {
    ctx.drawImage(bitmap, 0, 0)
  } catch {
    bitmap.close()
    return { ok: false, code: 'draw_failed' }
  } finally {
    bitmap.close()
  }

  const blob = await canvasToBlob(
    canvas,
    outputType,
    outputType === 'image/jpeg' ? JPEG_REENCODE_QUALITY : undefined
  )
  if (!blob) {
    return { ok: false, code: 'encode_failed' }
  }

  const name = extensionForMime(outputType, baseName)
  return { ok: true, item: { name, type: outputType, blob } }
}

export const reencodeBlobToMime = async (
  blob: Blob,
  mime: 'image/jpeg' | 'image/png',
  baseFileName: string,
  quality = JPEG_REENCODE_QUALITY
): Promise<StripOutcome> => {
  const bitmap = await readBitmapForStrip(blob)
  if (!bitmap) {
    return { ok: false, code: 'decode_failed' }
  }

  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return { ok: false, code: 'draw_failed' }
  }

  try {
    ctx.drawImage(bitmap, 0, 0)
  } catch {
    bitmap.close()
    return { ok: false, code: 'draw_failed' }
  } finally {
    bitmap.close()
  }

  const outBlob = await canvasToBlob(
    canvas,
    mime,
    mime === 'image/jpeg' ? quality : undefined
  )
  if (!outBlob) {
    return { ok: false, code: 'encode_failed' }
  }

  return {
    ok: true,
    item: {
      name: extensionForMime(mime, baseFileName),
      type: mime,
      blob: outBlob,
    },
  }
}

export const stripImageMetadata = async (
  file: File,
  options?: StripImageOptions
): Promise<StripOutcome> => {
  const bitmap = await readBitmapForStrip(file)
  if (!bitmap) {
    return { ok: false, code: 'decode_failed' }
  }

  const isJpeg = file.type === 'image/jpeg'
  const isPng = file.type === 'image/png'
  const outputType =
    options?.outputMime ??
    (isJpeg ? 'image/jpeg' : isPng ? 'image/png' : 'image/png')

  const baseName = file.name.replace(/\.(heic|heif|avif|tif|tiff)$/i, '.png')
  return bitmapToResult(bitmap, outputType, baseName)
}
