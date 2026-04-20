export const cleaningCopyEn = {
  backAria: 'Back',
  progress: {
    statusDone: 'Done',
    statusRunning: 'Processing…',
  },
  badges: {
    done: 'Secured',
    running: 'Cleaning',
  },
  headlineDone: 'Removal complete',
  headlineRunning: 'Removing metadata',
  sublineDone: (total: number) =>
    `Location and device-related data were removed from ${total} photo(s).`,
  sublineRunning: (total: number, done: number) =>
    `Processing ${done} of ${total} photo(s)…`,
  sublineNoPhotos: 'No photos selected.',
  failedLine: (n: number) => `Could not process ${n} file(s).`,
  statusCardLabel: 'Status',
  removedSectionTitle: 'Removed metadata',
  statusDataDone: 'Data protection complete',
  saveCta: 'Save to gallery',
  saveDisabled: 'Save is available after processing completes',
  shareCta: 'Share now',
  shareTitle: 'Photo Guard',
  shareText: 'Cleaned photos',
} as const
