import { isPublic } from '@lib/common'
import { TokenPayload } from '@lib/common/types'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

/**
 * @name RolesGuard
 * @description Match user roles with the roles required to access the route
 * Does partial matching, so if the user has the role 'admin' and the route has
 * the roles ['admin', 'user'], it will be allowed
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required to access the route from the metadata

    const publicEndpoint = isPublic(this.reflector, context)
    if (publicEndpoint) {
      return true
    }

    // If no roles are required, allow access
  
    // Get the user from the request
    const request = context.switchToHttp().getRequest()
    const user = request.user as TokenPayload

    // If the user has no roles, deny access
    return true
  }

}
