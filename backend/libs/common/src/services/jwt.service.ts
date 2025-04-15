import { Inject } from '@nestjs/common'
import { JwtService as MainJwtService } from '@nestjs/jwt'
import { CustomConfigService } from '../config'
import type { TokenPayload } from '../types'

export class JwtService extends MainJwtService {
  @Inject(CustomConfigService)
  private readonly configService: CustomConfigService

  signToken<T extends object = TokenPayload>(payload: T): string {
    return this.sign(payload, {
      secret: this.configService.getJwtSecret(),
      expiresIn: this.configService.getJwtExpiresIn(),
    })
  }

  verifyToken<T extends object = TokenPayload>(token: string): T | null {
    try {
      return this.verify<T>(token, {
        secret: this.configService.getJwtSecret(),
      })
    } catch (err) {
      return null
    }
  }
}
