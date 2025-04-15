import { ID } from '@db'
import { ApiProperty } from '@nestjs/swagger'

class ResendUserData {
  @ApiProperty({ type: String }) _id: ID
  @ApiProperty({ type: String }) phone: string
  @ApiProperty({ type: String }) name: string
  @ApiProperty({ type: String }) email: string
}

export class LoginResponse {
  @ApiProperty() user: ResendUserData
  @ApiProperty() token: string
}

export class LoginCodeResponse {
  @ApiProperty() user: ResendUserData
  @ApiProperty() checkCode: string
  @ApiProperty() requestId: string
}
