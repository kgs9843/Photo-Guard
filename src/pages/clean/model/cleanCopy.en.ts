export const cleanCopyEn = {
  loading: 'Reading metadata…',
  metadataUnavailable: 'No metadata found or it could not be read.',
  labels: {
    gps: 'Location (GPS)',
    device: 'Device info',
    captureTime: 'Capture time',
    shooting: 'Capture settings',
  },
  multiHints: {
    gps: 'Some selected photos include location coordinates.',
    device: 'Some selected photos include device-related metadata.',
    captureTime: 'Some selected photos include capture timestamps.',
    shooting:
      'Some selected photos include exposure, ISO, lens, and related metadata.',
  },
  stackExtraAlt: 'Selected photo',
  stackExtraLabel: 'photos',
  empty: {
    back: 'Back',
    title: 'No photos selected',
    body: 'Choose photos from the home screen.',
  },
  topBarBackAria: 'Back',
  selectedMany: (n: number) => `${n} selected`,
  selectedOne: '1 selected',
  heroMulti: (n: number) => `${n} photos`,
  heroSingleMeta: (count: number) => `${count} detail categories`,
  analyzing: 'Analyzing metadata…',
  multiRiskLine: (signals: number) =>
    `Detected ${signals} privacy-related signal(s) across the selection.`,
  singleRiskYes: 'Metadata that may relate to personal data was found.',
  singleRiskNo: 'No high-risk metadata patterns were detected.',
  sectionRisk: 'Risk summary',
  sectionDetail: 'Details',
  disclaimer:
    '* Removing metadata may permanently hide location, device details, and similar data from the exported image.',
  ctaAria: 'Remove metadata',
  ctaMulti: 'Remove metadata from all photos',
  ctaSingle: 'Remove selected metadata',
} as const
