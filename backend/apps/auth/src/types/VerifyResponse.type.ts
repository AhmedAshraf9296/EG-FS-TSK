import { ApiProperty } from '@nestjs/swagger'

class ResponseUserData {
  @ApiProperty() _id: string
  @ApiProperty() phone: string
  @ApiProperty() name: string
  @ApiProperty() permissions: string
  @ApiProperty() roles: string
  @ApiProperty() createdAt: string
}

export class VerifyResponse {
  @ApiProperty() otpVerified: boolean
  @ApiProperty()
  user: ResponseUserData
  @ApiProperty()
  token: string
}

export class VerifyResponseNewUser {
  @ApiProperty() otpVerified: boolean
}

export class ResendResponse {
  @ApiProperty() user: ResponseUserData
  @ApiProperty() checkCode: string
  @ApiProperty() requestId: string
}

export class CheckPhoneResponse {
  @ApiProperty()
  userExists: boolean
  otpVerified: boolean
}
