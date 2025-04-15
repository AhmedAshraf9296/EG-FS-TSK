import { ConstructObjectId } from '@db/utils'
import { JwtService } from '@lib/common/services'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'

@Injectable()
export class WsGuard implements CanActivate {
  private readonly logger = new Logger(WsGuard.name)

  @Inject(JwtService)
  private readonly jwtService: JwtService


  private getTokenFromHeader(context: ExecutionContext) {
    const client = context.switchToWs().getClient()
    const token = client.handshake.headers.authorization as string | null
    if (!token) return null
    return token.includes('Bearer') ? token.split(' ')[1] : token
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const bearerToken = this.getTokenFromHeader(context)
      this.logger.debug('Bearer Token Caught')
      if (!bearerToken) return false
      const decoded = this.jwtService.verifyToken(bearerToken)
      this.logger.debug(`Bearer Token Decoded: ${!!decoded}`)
      if (!decoded) return false
      const user = ""
      this.logger.debug(`User Found: ${!!user}`)
      if (!user) return false
      context.switchToWs().getClient().user = user
      return true
    } catch (ex) {
      this.logger.error(ex)
      return false
    }
  }
}
