
export interface TokenPayload {
  // User Id, 24 characters object it
  sub: string
  // user name
  name: string
  // User Roles, e.g. ['admin', 'user']
  // User Permissions, e.g. ['create', 'update', 'delete']
  permissions: string[]

  // User Language, e.g. ['en', 'ar']
  userLanguage: string
}

export class TokenPayloadDto {
  sub: string
  permissions: string[]
  userLanguage: string
}
