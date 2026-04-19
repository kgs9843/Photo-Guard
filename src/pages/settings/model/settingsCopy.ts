import { settingsCopyEn } from '@/pages/settings/model/settingsCopy.en'
import { settingsCopyKo } from '@/pages/settings/model/settingsCopy.ko'
import type { AppLocale } from '@/shared/model/appLocale'

export type SettingsCopyBundle = typeof settingsCopyKo

const byLocale: Record<AppLocale, SettingsCopyBundle> = {
  ko: settingsCopyKo,
  en: settingsCopyEn as unknown as SettingsCopyBundle,
}

export const getSettingsCopy = (locale: AppLocale): SettingsCopyBundle =>
  byLocale[locale] ?? settingsCopyKo

export type ExportFormatKey = keyof SettingsCopyBundle['exportFormatLabels']
