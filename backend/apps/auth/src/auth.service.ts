import {  JwtService } from '@lib/common/services'
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import type {
  LoginUserWithEmailDTO,
  SignUpUserDTO,
} from './dtos/user.dto'
import type { LoginResponse } from './types/LoginResponse.type'
import { HashService } from '@lib/common/services/hashing.service'
import { UsersService } from '@lib/common/users/users.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  @Inject(UsersService) private readonly usersService: UsersService
  @Inject(JwtService) private readonly jwtService: JwtService
  @Inject(HashService) private readonly hashService: HashService

  async signUpUser(userSignUpDto: SignUpUserDTO) {
    const user = await this.usersService.create(userSignUpDto)

    const token = this.jwtService.signToken({
      sub: user._id.toString(),
      name: user.name,
      email:user.email
    })

    return {
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token: token,
    }
  }


  async loginWithEmail(loginDto: LoginUserWithEmailDTO) {
    const user = await this.usersService.searchUsingEmailReturnPassword(
      loginDto.email.toLowerCase(),
    )

    if (!user) {
      throw new BadRequestException('User does not exist', {
        description: 'missing_user',
      })
    }

    if (!user.password) {
      throw new BadRequestException('User does not have password.', {
        description: 'missing_user_password',
      })
    }
    console.log('loginDto.password', loginDto.password);
    
    const passCheck = await this.hashService.compare(
      loginDto.password,
      user.password,
    )
    
    if (!passCheck) {
      throw new BadRequestException('Wrong password', {
        description: 'wrong_password',
      })
    }

    const token = this.jwtService.signToken({
      sub: user._id.toString(),
      name: user.name,
      email: user.email
    })

    return {
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        createdAt: user.createdAt
      },
      token,
    }
  }
}
