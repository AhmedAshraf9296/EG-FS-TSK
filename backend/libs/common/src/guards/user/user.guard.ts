import { isPublic } from '@lib/common/decorators'
import type { TokenPayload } from '@lib/common/types'
import { UsersService } from '@lib/common/users/users.service'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

// NOTE: This guard is used to check if the user is logged in or not
@Injectable()
export class RequireUserGuard implements CanActivate {
  private readonly logger = new Logger(RequireUserGuard.name)

  constructor(
    private readonly reflector: Reflector,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicEndpoint = isPublic(this.reflector, context)
    if (publicEndpoint) {
      return true
    }
    const req = context.switchToHttp().getRequest()
    const user = req.user as TokenPayload
    if (!user) {
      this.logger.debug('No user found')
      throw new UnauthorizedException()
    }
    const userFromDb = await this.userService.getOne(user.sub)
    if (!userFromDb) {
      this.logger.debug(
        `User not found in database ${user.name} ${user.sub}`,
      )
      throw new UnauthorizedException()
    }
    req.user = {
      ...user
    }

    return true
  }
}
