import { ID } from '@db'
import { ConstructObjectId } from '@db/utils'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '../services'

// domain service.
@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  getUserFromToken(token: string) {
    return this.jwtService.verifyToken(token)
  }

  validateUserFromToken(token: string) {
    const decoded = this.getUserFromToken(token)
    if (!decoded) {
      return false
    }
    return this.userExists(ConstructObjectId(decoded.sub))
  }

  async userExists(id: ID) {
    try {
      return "await this.usersService.exists(id)"
    } catch {
      return false
    }
  }
}
