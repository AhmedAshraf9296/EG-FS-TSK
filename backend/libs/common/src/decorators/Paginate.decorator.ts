import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { booleanify } from '../utils'

export const Paginate = createParamDecorator(
  (
    options: {
      defaultSortKey?: string
      defaultSortDirection?: 1 | -1
      defaultPage?: number
    } = {
      defaultSortKey: 'createdAt',
      defaultSortDirection: -1,
      defaultPage: 0,
    },
    context: ExecutionContext,
  ) => {
    /// Sane defaults
    const defaultPage = options.defaultPage ?? 0

    // Get the request object
    const request = context.switchToHttp().getRequest()

    // Get the page from the request query, and parse it to an integer greater than 0
    const requestPage = parseInt(request.query?.page)
    const isValidPage = !isNaN(requestPage) && requestPage > 0
    const page = isValidPage ? requestPage - 1 : defaultPage

    // Get the limit from the request query, and parse it to an integer greater than 0
    const requestLimit = parseInt(request.query?.limit)
    const isValidLimit =
      !isNaN(requestLimit) || requestLimit > 0 || requestLimit < 51
    let limit = isValidLimit ? requestLimit : 10
    // Skip is the page * limit, meaning if the page is 2 and limit is 10 then we want to skip 20 results
    let skip = page * limit

    // If the page is less than 1, and is allowed. We want to return all results.
    if (requestPage < 1 && defaultPage < 0) {
      limit = 0
      skip = 0
    }

    // Get the sort key from the request query, and direction from the request query.
    const sortKey = request.query?.sortKey || options.defaultSortKey
    // Only handle ascending or descending, default to descending.
    // By default, the query is a string. If its true, then we want to sort ascending.
    const sortAsc = booleanify(request.query?.sortAsc)
      ? 1
      : options.defaultSortDirection

    // Return the pagination object
    return {
      page,
      skip,
      limit,
      sortKey,
      sortAsc,
    }
  },
)
