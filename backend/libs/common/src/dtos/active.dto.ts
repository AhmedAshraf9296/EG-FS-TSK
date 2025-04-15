export const ActiveEnum = ['true', 'false', 'all'] as const
export const ActiveEnumValues = Object.values(ActiveEnum)
export type ActiveType = (typeof ActiveEnum)[number]
