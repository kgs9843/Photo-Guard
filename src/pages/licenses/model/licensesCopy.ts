import { licensesPageCopyEn } from '@/pages/licenses/model/licensesPageCopy.en'
import { licensesPageCopyKo } from '@/pages/licenses/model/licensesPageCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type LicenseEntry = {
  name: string
  licenseBadge: string
  lines: readonly string[]
}

export const licenseEntries: readonly LicenseEntry[] = [
  {
    name: 'Tailwind CSS',
    licenseBadge: 'MIT License',
    lines: ['https://tailwindcss.com/', 'Copyright (c) Tailwind Labs, Inc.'],
  },
  {
    name: 'Vite',
    licenseBadge: 'MIT License',
    lines: [
      'https://vitejs.dev/',
      'Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors',
    ],
  },
  {
    name: 'React',
    licenseBadge: 'MIT License',
    lines: [
      'https://react.dev/',
      'Copyright (c) Meta Platforms, Inc. and affiliates.',
    ],
  },
  {
    name: 'react-router',
    licenseBadge: 'MIT License',
    lines: [
      'https://reactrouter.com/',
      'Copyright (c) React Training LLC 2015-2019 Copyright (c) Remix Software Inc. 2020-2021 Copyright (c) Shopify Inc. 2022-2023',
    ],
  },
  {
    name: 'lucide-react',
    licenseBadge: 'ISC License',
    lines: [
      'https://lucide.dev/',
      'Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All copyright (c) for Lucide are held by Lucide Contributors 2022.',
    ],
  },
  {
    name: 'exifr',
    licenseBadge: 'MIT License',
    lines: [
      'https://github.com/MikeKovarik/exifr',
      'Copyright (c) Mike Kovarik',
    ],
  },
  {
    name: 'react-icons',
    licenseBadge: 'MIT License',
    lines: [
      'https://github.com/react-icons/react-icons',
      'Copyright (c) 2018 Goran Gajic',
    ],
  },
  {
    name: 'Google Fonts (Manrope)',
    licenseBadge: 'OFL 1.1',
    lines: [
      'https://fonts.google.com/specimen/Manrope',
      'Copyright 2018 The Manrope Project Authors (https://github.com/sharanda/manrope)',
    ],
  },
] as const

export type LicensesPageCopyBundle = typeof licensesPageCopyKo

const pageByLocale: Record<AppLocale, LicensesPageCopyBundle> = {
  ko: licensesPageCopyKo,
  en: licensesPageCopyEn as unknown as LicensesPageCopyBundle,
}

export const getLicensesPageCopy = (
  locale: AppLocale
): LicensesPageCopyBundle => pageByLocale[locale] ?? licensesPageCopyKo
