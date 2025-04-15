import { ApiProperty } from '@nestjs/swagger'

export class UserPopulatedType {
  @ApiProperty()
  _id: string

  @ApiProperty()
  name: string
}
