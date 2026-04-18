import { Calendar, ImageOff, MapPinOff, Smartphone, UserX } from 'lucide-react'

import type { HomeCopy } from '@/pages/dashboard/model/homeCopy.types'
import { MAX_PHOTOS_PER_BATCH } from '@/pages/dashboard/model/photoSelectionLimits'

export const homeCopyEn: HomeCopy = {
  homeHero: {
    title: 'Choose photos',
    subtitle: 'Remove metadata and share more safely.',
  },
  homePrivacyHeading: 'Privacy guide',
  photoSelection: {
    maxCount: MAX_PHOTOS_PER_BATCH,
    truncatedAlert: (selectedTotal: number) =>
      `You can process up to ${MAX_PHOTOS_PER_BATCH} photos at once. (${selectedTotal} selected — using the first ${MAX_PHOTOS_PER_BATCH}.)`,
  },
  privacyTips: [
    {
      Icon: MapPinOff,
      title: 'Why strip location data',
      body: 'Latitude and longitude in a photo can reveal where you live.',
    },
    {
      Icon: Smartphone,
      title: 'Hide device fingerprints',
      body: 'Camera model and device IDs can identify your hardware.',
    },
    {
      Icon: UserX,
      title: 'Face and people metadata',
      body: 'Clear person tags and face-related fields your gallery may store.',
    },
    {
      Icon: Calendar,
      title: 'Timestamp risk',
      body: 'Exact date and time can expose routines and habits.',
    },
    {
      Icon: ImageOff,
      title: 'Thumbnail leftovers',
      body: 'Edited originals can still leave traces in embedded thumbnails.',
    },
  ],
}
