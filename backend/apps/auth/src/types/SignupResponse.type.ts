import { ApiProperty } from '@nestjs/swagger'

class SignUpUserRes {
  @ApiProperty() _id: string
  @ApiProperty() phone: string
  @ApiProperty() name: string
  @ApiProperty() permissions: string
  @ApiProperty() roles: string
  @ApiProperty() createdAt: string
}

export class SignupResponse {
  @ApiProperty() user: SignUpUserRes
  @ApiProperty() token: string
}
