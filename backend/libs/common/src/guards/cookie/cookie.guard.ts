import type { ServerRequest, WrapperType } from '@lib/common'
import { isPublic } from '@lib/common/decorators/Public.decorator'
import { JwtService } from '@lib/common/services'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

// NOTE: This guard is used to get the user from the token ONLY, it doesn't enforce login
@Injectable()
export class CookieGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: WrapperType<JwtService>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromCookie(request)

    // This guard should only try to extract the user from the token, it doesn't enforce login
    if (!token) {
      return true
    }

    // NOTE: if its a public endpoint, we don't need to check for token
    // However keep checking to get the user if token is present
    // Sometimes we want different behavior for public endpoints (If user exists or not) like submiting a public form
    const publicEndpoint = isPublic(this.reflector, context)
    try {
      const payload = this.verifyCookieToken(token)

      if (!payload) {
        if (publicEndpoint) return true
        throw new UnauthorizedException()
      }

      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private verifyCookieToken(token: string) {
    return this.jwtService.verifyToken(token)
  }

  private extractTokenFromCookie(request: ServerRequest): string | undefined {
    return request.cookies['authentication']
    /* || request.cookies['authentication'] // in case of testing */
  }
}
