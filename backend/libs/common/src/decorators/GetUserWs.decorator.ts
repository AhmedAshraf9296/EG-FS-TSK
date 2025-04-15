import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const WsGetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const user = context.switchToWs().getClient().user
    if (data) return user[data]
    return user
  },
)

export const WsGetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const user = context.switchToWs().getClient().user
    return user._id
  },
)
