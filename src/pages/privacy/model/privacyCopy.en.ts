export const privacyCopyEn = {
  topBarTitle: 'Terms & privacy',
  heroTitle: 'Terms of service and privacy policy',
  heroLead:
    'Photo Guard removes location/time/device hints (EXIF-like metadata) by re-encoding selected images inside your browser. This document is based on the current implementation (on-device processing and local-only storage).',
  terms: {
    title: 'Terms of service',
    lead: 'These terms describe the rules, responsibilities, and limitations for using the Photo Guard web app (the “Service”).',
    sections: [
      {
        title: 'How the Service works',
        bodyLines: [
          'The Service decodes selected images in the browser, draws them to a canvas, and exports a cleaned JPEG/PNG.',
          'Processing is performed on your device. The Service does not upload your original images to our servers.',
        ],
      },
      {
        title: 'Your responsibilities',
        bodyLines: [
          'You should review the output before sharing or uploading it elsewhere.',
          'You must comply with applicable laws and respect third-party rights (copyright, portrait rights, etc.).',
        ],
      },
      {
        title: 'Limitations and disclaimer',
        bodyLines: [
          'Re-encoding reduces embedded metadata, but it cannot guarantee 100% removal for every file/browser/format combination.',
          'The Service is provided “as is” and may fail or produce degraded results depending on your environment.',
        ],
      },
      {
        title: 'Changes',
        bodyLines: [
          'We may update these terms and provide notice within the Service when appropriate.',
        ],
      },
    ],
  },
  policy: {
    title: 'Privacy policy',
    lead: 'Photo Guard works without account sign-up and does not upload original images to a server. Some information may be stored locally in your browser to provide core features.',
  },
  collection: {
    title: 'What is stored locally (current implementation)',
    lead: 'The Service may store the following data in your browser storage:',
    items: [
      {
        label: 'Cleaning history (IndexedDB):',
        text: 'Cleaned image blobs and metadata such as filename, timestamps, file size, and removal summaries (e.g., GPS/device/capture time).',
      },
      {
        label: 'Preferences (localStorage):',
        text: 'Export format (JPG/PNG) and language preference (ko/en).',
      },
    ],
  },
  purpose: {
    title: 'Purposes of processing',
    lead: 'Local storage is used for the following purposes:',
    cards: [
      {
        title: 'Provide the service',
        body: 'Show your cleaning history and allow re-download/share of cleaned outputs.',
      },
      {
        title: 'Remember preferences',
        body: 'Keep your export format and language selection across visits.',
      },
    ],
  },
  sharing: {
    title: 'Sharing and transfers',
    bodyLines: [
      'The Service does not upload your original images or cleaned outputs to our servers by default.',
      'If you use the system “Share” feature, your browser/OS (or an app hosting the webview) may transfer the file to the destination you choose.',
    ],
  },
  retention: {
    title: 'Retention',
    body: 'Cleaning history may persist locally until you delete it.',
    boxLines: [
      'Delete from the app: Settings > “Clear history” removes cleaning history stored in IndexedDB.',
      'Delete from the browser: clearing site data may also remove localStorage preferences.',
    ],
  },
  effectiveDate: 'Effective date: April 22, 2026.',
} as const
