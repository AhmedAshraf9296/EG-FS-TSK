import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { TokenPayload } from '../types'

export const GetCurrentUser = createParamDecorator(
  (data: keyof TokenPayload, context: ExecutionContext) => {
    const req: {
      user: TokenPayload
    } = context.switchToHttp().getRequest()
    if (data) return req.user[data]
    return req.user
  },
)

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): string => {
    const req: {
      user: TokenPayload
    } = context.switchToHttp().getRequest()
    return req.user['sub']
  },
)
