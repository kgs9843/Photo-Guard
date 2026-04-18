# IndexedDB (Photo Guard)

- **Lookup:** 2026-04-18
- **Use:** `photo-guard-v1` database, object store `cleanedHistory`, `keyPath: 'id'` for cleaned image blobs + metadata.
- **Evidence:** [Using IndexedDB (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) — `indexedDB.open`, `createObjectStore`, `transaction` + `put` / `getAll` / `clear`.
