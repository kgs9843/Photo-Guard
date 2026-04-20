# Web Share API (official references)

- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- MDN (sharing files): https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare

Notes:

- `navigator.share()` availability depends on browser/device context (typically mobile).
- File sharing requires secure context (HTTPS) and support for `files` in the share payload.
- In React Native WebView, prefer the `postMessage` bridge: [`react-native-webview-bridge.md`](react-native-webview-bridge.md).
