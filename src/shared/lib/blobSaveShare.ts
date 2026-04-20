/**
 * Gallery save + system share for desktop/mobile browsers and React Native WebView.
 * RN host must handle postMessage — see docs/references/react-native-webview-bridge.md
 */

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void }
  }
}

const RN_SAVE = 'PHOTO_GUARD_SAVE_IMAGE' as const
const RN_SHARE = 'PHOTO_GUARD_SHARE' as const

export const isReactNativeWebViewHost = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.ReactNativeWebView?.postMessage === 'function'

function postToReactNative(payload: Record<string, unknown>): void {
  window.ReactNativeWebView!.postMessage(JSON.stringify(payload))
}

export async function blobToBase64Payload(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const comma = dataUrl.indexOf(',')
      resolve(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl)
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error('read failed'))
    }
    reader.readAsDataURL(blob)
  })
}

export async function saveBlobAsFile(
  blob: Blob,
  filename: string
): Promise<void> {
  if (isReactNativeWebViewHost()) {
    const base64 = await blobToBase64Payload(blob)
    postToReactNative({
      type: RN_SAVE,
      base64,
      filename,
      mimeType: blob.type || 'application/octet-stream',
    })
    return
  }

  const url = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.rel = 'noopener'
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  } finally {
    window.setTimeout(() => {
      try {
        URL.revokeObjectURL(url)
      } catch {
        /* ignore */
      }
    }, 1500)
  }
}

export type ShareExtras = {
  title?: string
  text?: string
}

export async function shareBlobs(
  items: Array<{ blob: Blob; filename: string }>,
  extras: ShareExtras
): Promise<void> {
  if (items.length === 0) return

  if (isReactNativeWebViewHost()) {
    for (const item of items) {
      const base64 = await blobToBase64Payload(item.blob)
      postToReactNative({
        type: RN_SHARE,
        base64,
        filename: item.filename,
        mimeType: item.blob.type || 'image/jpeg',
        title: extras.title,
        text: extras.text,
      })
    }
    return
  }

  if (
    typeof navigator === 'undefined' ||
    typeof navigator.share !== 'function'
  ) {
    throw new Error('share not supported')
  }

  const files = items.map(
    item =>
      new File([item.blob], item.filename, {
        type: item.blob.type || 'image/jpeg',
      })
  )
  const withFiles = { files }
  if (navigator.canShare?.(withFiles)) {
    await navigator.share({ ...withFiles, ...extras })
    return
  }

  if (items.length === 1) {
    const url = URL.createObjectURL(items[0].blob)
    try {
      await navigator.share({
        title: extras.title,
        text: extras.text,
        url,
      })
    } finally {
      window.setTimeout(() => {
        try {
          URL.revokeObjectURL(url)
        } catch {
          /* ignore */
        }
      }, 1500)
    }
    return
  }

  await navigator.share({
    title: extras.title,
    text: extras.text,
  })
}

export const canUseSystemShare = (): boolean =>
  isReactNativeWebViewHost() ||
  (typeof navigator !== 'undefined' && typeof navigator.share === 'function')
