# File picker & preview (official references)

- **File input (`<input type="file">`)**: [MDN — `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
- **Preview via object URL**: [MDN — `URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- **Cleanup**: [MDN — `URL.revokeObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL)
- **EXIF parsing**: [`exifr` on npm](https://www.npmjs.com/package/exifr) — `exifr.parse(file, tags)`

Notes:

- Use `multiple` to allow selecting one or many.
- Always `revokeObjectURL` when leaving the page to avoid leaking memory.
