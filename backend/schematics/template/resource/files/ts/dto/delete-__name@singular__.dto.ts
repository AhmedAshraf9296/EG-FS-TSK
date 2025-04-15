import { IsArrayOfObjectIds } from '@lib/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class Delete<%= singular(classify(name)) %>Dto {

  @ApiProperty({ type: [String] })
  @IsArrayOfObjectIds()
  ids: string[]
}
