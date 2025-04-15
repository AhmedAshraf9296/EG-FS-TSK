import type { ServerRequest, WrapperType } from '@lib/common'
import { isPublic } from '@lib/common/decorators/Public.decorator'
import { JwtService } from '@lib/common/services'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

// NOTE: This guard is used to get the user from the token ONLY, it doesn't enforce login
@Injectable()
export class TokenGuard implements CanActivate {
  private readonly logger = new Logger(TokenGuard.name)

  constructor(
    @Inject(forwardRef(() => JwtService))
    private jwtService: WrapperType<JwtService>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    // This guard should only try to extract the user from the token, it doesn't enforce login
    if (!token) {
      return true
    }
    // NOTE: if its a public endpoint, we don't need to check for token
    // However keep checking to get the user if token is present
    // Sometimes we want different behavior for public endpoints (If user exists or not) like submiting a public form
    const publicEndpoint = isPublic(this.reflector, context)
    try {
      const payload = this.verifyToken(token)

      if (!payload) {
        if (publicEndpoint) return true
        this.logger.debug('No user found in token')
        throw new UnauthorizedException()
      }

      request['user'] = payload
    } catch {
      this.logger.debug('Invalid token')
      throw new UnauthorizedException()
    }
    return true
  }

  private verifyToken(token: string) {
    return this.jwtService.verifyToken(token)
  }

  private extractTokenFromHeader(request: ServerRequest): string | undefined {
    return request.headers?.authorization?.replace(/Bearer /g, '')
  }
}
