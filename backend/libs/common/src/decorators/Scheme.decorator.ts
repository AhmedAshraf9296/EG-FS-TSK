import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { ServerRequest } from '../types'

/**
 *  @description Get the scheme from the request
 *  @returns {string} - The Scheme
 */
export const HttpScheme = createParamDecorator(
  (data = null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ServerRequest>()
    return request.headers['x-forwarded-proto'] || request.protocol
  },
)
