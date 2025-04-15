import { ApiProperty } from '@nestjs/swagger'

export class CommonMeResponseType {
  @ApiProperty({ type: String, description: 'User id' })
  sub: string
  @ApiProperty({ type: String, description: 'User name' })
  name: string
  @ApiProperty({ type: String, description: 'User roles' })
  roles: [string]
  @ApiProperty({ type: String, description: 'User permissions' })
  permissions: [string]
}
