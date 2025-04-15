import { Public, SwaggerDocumentation, WrapperType } from '@lib/common'
import { HttpScheme } from '@lib/common/decorators/Scheme.decorator'
import { GenericResponse } from '@lib/common/helpers/nest.helper'
import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { cookieOptions } from './common/cookie.options'
import { SignUpUserDTO } from './dtos/user.dto'
import { SignupResponse } from './types/SignupResponse.type'

@ApiTags('auth')
@Controller('signup')
@Public()
export class SignupController {
  @Inject() private readonly authService: AuthService

  @SwaggerDocumentation({
    summary: 'Sign up a user',
    okDescription: 'User signed up successfully',
    status: HttpStatus.CREATED,
    badRequestDescription: 'User already exists',
    badStatus: HttpStatus.CONFLICT,
    okType: SignupResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Body recieved',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Phone number not verified',
  })
  @ApiBody({
    type: SignUpUserDTO,
    examples: {
      'new user with phone only': {
        value: {
          name: 'Ahmed Ashraf',
          phone: '+201288768405',
          password: '123456',
          email:"ahmed.ashraf@gmail.com"
        },
      },
      'Phone not verified': {
        value: {
          name: 'ahmed msh verified',
          phone: '+201538368405',
          password: '123456',
          email:"ahmed.ashraf@gmail.com"
        },
      },
      'Wrong Phone': {
        value: {
          name: 'ay haga',
          phone: '38368405',
          password: '123456',
        },
      },
      'Wrong ZipCode length': {
        value: {
          name: 'ay haga',
          phone: '+201538368405',
          password: '123456',
        },
      },
    },
  })
  @Post()
  async signup(
    @Body() userSignUpDto: SignUpUserDTO,
    @HttpScheme() scheme: string,
    @GenericResponse() responseHelper: WrapperType<GenericResponse>,
  ) {
    const res = await this.authService.signUpUser(userSignUpDto)
    if ('token' in res) {
      responseHelper.setCookie(
        'authentication',
        res.token,
        cookieOptions(scheme),
      )
      responseHelper.setCookie('check_token', 'true', {
        ...cookieOptions(scheme),
        httpOnly: false,
      })
      responseHelper.setStatus(HttpStatus.CREATED)
      return res
    }
    return res
  }
}
