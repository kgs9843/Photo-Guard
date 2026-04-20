# React Native WebView — save / share bridge (Photo Guard)

**조회:** 2026-04-21 · **대상:** 웹 번들 + `react-native-webview`로 감싼 앱

## 공식 참고

- `react-native-webview` — communicating with the webview: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native

웹에서는 `window.ReactNativeWebView.postMessage(string)`으로 **문자열만** 보낼 수 있다. 네이티브는 `onMessage`에서 수신한다.

## Photo Guard 메시지 계약 (v1)

웹(`src/shared/lib/blobSaveShare.ts`)이 보내는 JSON 문자열:

### 갤러리/다운로드 저장

```json
{
  "type": "PHOTO_GUARD_SAVE_IMAGE",
  "base64": "<data without data: URL prefix>",
  "filename": "photo.jpg",
  "mimeType": "image/jpeg"
}
```

### 공유 시트

```json
{
  "type": "PHOTO_GUARD_SHARE",
  "base64": "<data without data: URL prefix>",
  "filename": "photo.jpg",
  "mimeType": "image/jpeg",
  "title": "optional",
  "text": "optional"
}
```

여러 장을 한 번에 공유할 때는 **파일마다 메시지가 연속으로** 온다. 네이티브는 각각 `Intent.ACTION_SEND` 등으로 처리하거나, 첫 장만 처리하도록 단순화할 수 있다.

## 네이티브 구현 요약

1. Base64를 디코드해 임시 파일 또는 `content://` URI를 만든다.
2. `PHOTO_GUARD_SAVE_IMAGE`: MediaStore / `WRITE_EXTERNAL_STORAGE` 흐름 등으로 갤러리에 저장.
3. `PHOTO_GUARD_SHARE`: `Intent.createChooser` + `EXTRA_STREAM`으로 시스템 공유를 연다.

WebView의 `<a download>` / `navigator.share`는 Android WebView 기본 설정에서 자주 막히므로, 위 브리지가 **APK/WebView 환경의 기본 경로**다.
