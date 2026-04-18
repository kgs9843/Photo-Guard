export const HISTORY_UPDATED_EVENT = 'photo-guard:history-updated'

export const dispatchHistoryUpdated = (): void => {
  try {
    window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT))
  } catch {
    /* ignore */
  }
}
