# Stripping image metadata by re-encoding (official references)

In-browser approach used here:
1) Decode image → 2) draw pixels to `<canvas>` → 3) export via `toBlob()`.

Official docs:
- `createImageBitmap()`: https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
- Canvas draw: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
- `HTMLCanvasElement.toBlob()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- Download via `<a download>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download

Notes:
- Re-encoding strips EXIF/ancillary metadata because output contains only the encoded pixel data.
- Output format is limited by browser encoders (JPEG/PNG).

