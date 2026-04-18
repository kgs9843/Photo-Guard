import type { CleanMetadataItem, CleanMetadataSummary } from './types'

export const cleanSummaryMock: CleanMetadataSummary = {
  totalCount: 12,
  riskLabel: 'Risk detected',
  riskDescription: 'Potential privacy-related metadata found.',
} as const

export const cleanMetadataItemsMock: CleanMetadataItem[] = [
  {
    id: 'gps',
    kind: 'gps',
    title: 'GPS location data',
    description: 'Location metadata is present.',
    severity: 'warning',
  },
  {
    id: 'device',
    kind: 'device',
    title: 'Device info',
    description: 'Camera model / device identifiers may be present.',
    severity: 'neutral',
  },
  {
    id: 'datetime',
    kind: 'datetime',
    title: 'Captured date & time',
    description: 'Exact timestamps can reveal routines.',
    severity: 'neutral',
  },
  {
    id: 'camera',
    kind: 'camera',
    title: 'Camera settings',
    description: 'Aperture / ISO / focal length metadata is present.',
    severity: 'neutral',
  },
]
