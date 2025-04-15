export const ServiceRequestsTypeEnum = {
  TAKWEED: 'takweed',
  CONTRACT: 'contract',
  OTHER: 'other',
} as const

export type ServiceRequestsType =
  (typeof ServiceRequestsTypeEnum)[keyof typeof ServiceRequestsTypeEnum]

export const ServiceRequestsTypeValues = Object.values(ServiceRequestsTypeEnum)
