import {
  CustomConfigService,
  GetCurrentUser,
  Public,
  SwaggerDocumentation,
  TokenPayloadDto,
  WrapperType,
} from '@lib/common'
import { HttpScheme } from '@lib/common/decorators/Scheme.decorator'
import { CookieGuard } from '@lib/common/guards/cookie/cookie.guard'
import { RequireUserGuard } from '@lib/common/guards/user/user.guard'
import { GenericResponse } from '@lib/common/helpers/nest.helper'
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { cookieOptions } from './common/cookie.options'
import {
  LoginUserWithEmailDTO,
} from './dtos/user.dto'
import { LoginResponse } from './types/LoginResponse.type'

@ApiTags('auth')
@Controller('login')
@Public()
export class LoginController {
  private readonly logger = new Logger(LoginController.name)

  @Inject(AuthService) private readonly authService: AuthService
  @Inject(CustomConfigService) configService: CustomConfigService

  @SwaggerDocumentation({
    summary: 'Login User using email',
    description: `User logins using email.
*Will not create user if not exists.*

### User flow:
1. User Types email and Password
1. User is logged in 

### Request flow: 
1. Send login request with email and password 
1. Recieve token and user data 

### ErrorCodes:
error: 'missing_user' => User Doesn't Exist in DB!  
error: 'wrong_passsword' => User Entered Wrong Password  
error: 'user_not_active' => User is not active, return to admin  
error: 'missing_user_password' => User Doesn't Have Password, return to admin  
`,
    okType: LoginResponse,
    okDescription: 'Return token',
    badRequestDescription: 'Invalid User Data',
  })
  @ApiBody({
    type: LoginUserWithEmailDTO,
    examples: {
      'user with valid email': {
        value: {
          email: 'admin@mail.com',
          password: '123456',
        },
      },
      'user with invalid email': {
        value: {
          email: 'admin@mail.com',
          password: '123456',
        },
      },
    },
  })
  @Post('email')
  @HttpCode(HttpStatus.OK)
  async loginWithEmail(
    @Body() loginDto: LoginUserWithEmailDTO,
    @HttpScheme() scheme: string,
    @GenericResponse() response: WrapperType<GenericResponse>,
  ) {
    this.logger.log(`Login with email ${loginDto.email}`)
    const res = await this.authService.loginWithEmail(loginDto)
    response.setCookie('authentication', res.token, cookieOptions(scheme))
    response.setCookie('check_token', 'true', {
      ...cookieOptions(scheme),
      httpOnly: false,
    })
    return res
  }

  @SwaggerDocumentation({
    summary: 'Logout User (Cookie)',
    description: `User logouts using cookie.
*Will not create user if not exists.* 

### User flow:
1. User clicks logout button 
1. User is logged out 

### Request flow: 
1. Send logout request with cookie 
`,
    okType: String,
    status: HttpStatus.OK,
    okDescription: 'Nothing (204)',
    badRequestDescription: 'Invalid Cookie or nothing to do',
  })
  @UseGuards(CookieGuard, RequireUserGuard)
  @Post('logout')
  async logout(
    @GetCurrentUser() user: TokenPayloadDto,
    @GenericResponse() response: WrapperType<GenericResponse>,
  ) {
    this.logger.log(`Logout ${user.sub}`)
    response.setCookie('authentication', '', { maxAge: 0 })
    response.setCookie('check_token', '', { maxAge: 0 })
    return 'ok'
  }
}
