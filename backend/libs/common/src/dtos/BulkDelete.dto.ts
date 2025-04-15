import { ApiProperty } from '@nestjs/swagger'

export class BulkDeleteResponse {
  @ApiProperty()
  message: 'Deleted Items'
  @ApiProperty()
  numOfDeleted: number
  @ApiProperty()
  recivedIdsLength: number
  @ApiProperty()
  foundAllItems: boolean
}
