export const privacyCopyEn = {
  topBarTitle: 'Privacy policy',
  heroTitle: 'Photo Guard privacy policy',
  heroLead:
    'Photo Guard ("we") respects your privacy. This policy explains what information may be processed, how it is used, and the measures we take to protect it while you use the web app.',
  collection: {
    title: 'Information we may process',
    lead: 'Depending on how you use the service, the following categories may apply:',
    items: [
      {
        label: 'Device:',
        text: 'Device identifiers where the browser exposes them, OS version, and basic app usage signals.',
      },
      {
        label: 'Optional:',
        text: 'Contact details you voluntarily provide for support (e.g., email).',
      },
      {
        label: 'Automatic:',
        text: 'Service logs such as access timestamps and coarse network information when required for security.',
      },
    ],
  },
  purpose: {
    title: 'Purposes of processing',
    lead: 'We use the information described above for the following purposes:',
    cards: [
      {
        title: 'Provide the service',
        body: 'Deliver features, keep sessions stable, and improve reliability and performance.',
      },
      {
        title: 'Safety and abuse prevention',
        body: 'Detect misuse, protect accounts and infrastructure, and comply with applicable law.',
      },
    ],
  },
  retention: {
    title: 'Retention',
    body: 'We retain information only as long as needed for the purposes above or as required by law. When retention is no longer necessary, we delete or anonymize data without undue delay.',
    boxLines: [
      'Example retention: service access logs and related technical records',
      'Typical period: up to 3 months where telecommunications rules apply (illustrative).',
    ],
  },
  effectiveDate: 'This policy is effective as of April 20, 2026.',
} as const
