# Online/offline detection (official references)

- MDN: `navigator.onLine` — https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
- MDN: `online` event — https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event
- MDN: `offline` event — https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event

Notes:

- `navigator.onLine` is a heuristic and may not guarantee actual internet reachability.
- For a stronger check, ping a known endpoint; this project uses the heuristic per requirements.
