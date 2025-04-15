import { IsArrayOfObjectIds } from '@lib/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class DeleteUserDto {

  @ApiProperty({ type: [String] })
  @IsArrayOfObjectIds()
  ids: string[]
}
