import { ApiProperty } from '@nestjs/swagger'

export class MessageResponse {
  @ApiProperty({ type: String }) message: string
  @ApiProperty({ example: false }) error: boolean
}
