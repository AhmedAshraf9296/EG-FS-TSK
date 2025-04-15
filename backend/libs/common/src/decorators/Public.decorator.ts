import { ExecutionContext, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

const publicKey = 'isPublic'
export const Public = () => SetMetadata(publicKey, true)

export const isPublic = (reflector: Reflector, context: ExecutionContext) => {
  if (
    reflector.getAllAndOverride(publicKey, [
      context.getHandler(), // for route handler
      context.getClass(), // for controller
    ])
  ) {
    return true
  }
}
