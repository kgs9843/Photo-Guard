export const historyDetailCopyEn = {
  loading: 'Loading…',
  statusTitle: 'Protected',
  statusBody: 'Sensitive details were removed from this image.',
  sectionRemovedHeading: 'Removed metadata',
  sectionEvidenceHeading: 'Detected before removal',
  sectionOtherTagsHeading: 'Other technical tags',
  otherTagsLegacyHint:
    'This entry does not store per-tag details. New cleanings show itemized tags.',
  otherTagsTruncatedNote: (total: number, shown: number) =>
    `Showing top ${shown} of ${total} tags.`,
  badgeCleared: 'Protected (fully cleared)',
  badgeOther: (count: number) => `Protected (${count} items cleared)`,
  notFoundTitle: 'Record not found.',
  notFoundCta: 'Back to list',
  saveToGallery: 'Save to gallery',
  share: 'Share',
  saveFailed: 'Could not save the image. Please try again later.',
  shareFailed: 'Sharing could not be completed.',
  shareUnsupported: 'Sharing is not supported in this environment.',
} as const
