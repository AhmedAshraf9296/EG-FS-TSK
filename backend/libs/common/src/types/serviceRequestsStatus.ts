export const ServiceRequestsStatusEnum = {
  REQUESTED: 'requested',
  UNDERREVIEW: 'underreview',
  ACCEPTED: 'accepted',
  UNDERPROCESSING: 'underprocessing',
  COMPLETED: 'completed',
} as const

export type ServiceRequestsStatus =
  (typeof ServiceRequestsStatusEnum)[keyof typeof ServiceRequestsStatusEnum]

export const ServiceRequestsStatusValues = Object.values(
  ServiceRequestsStatusEnum,
)

export const ServiceRequestsStatusEnumWithouthAll = {
  English: 'en',
  Arabic: 'ar',
} as const

export type ServiceRequestsStatusWithoutAll =
  (typeof ServiceRequestsStatusEnumWithouthAll)[keyof typeof ServiceRequestsStatusEnumWithouthAll]

export const ServiceRequestsStatusValuesWithoutAll = Object.values(
  ServiceRequestsStatusEnumWithouthAll,
)
