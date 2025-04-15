import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { ServerRequest } from '../types'

/**
 *  @description Gets query params without pagination and sorting params
 *  @returns {Record<string, string>} Query params without pagination and sorting params
 */
export const FilterQuery = createParamDecorator(
  (data = null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ServerRequest>()
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      page: _page,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      limit: _limit,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sortKey: _sortKey,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sortAsc: _sortAsc,
      ...rest
    } = request.query as Record<string, string>

    return rest
  },
)
