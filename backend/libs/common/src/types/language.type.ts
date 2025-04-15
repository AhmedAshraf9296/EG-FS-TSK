export const LanguageEnum = {
  English: 'en',
  Arabic: 'ar',
  All: 'all',
} as const

export type LanguageType = (typeof LanguageEnum)[keyof typeof LanguageEnum]

export const LanguageValues = Object.values(LanguageEnum)

export const LanguageEnumWithouthAll = {
  English: 'en',
  Arabic: 'ar',
} as const

export type LanguageTypeWithoutAll =
  (typeof LanguageEnumWithouthAll)[keyof typeof LanguageEnumWithouthAll]

export const LanguageValuesWithoutAll = Object.values(LanguageEnumWithouthAll)
