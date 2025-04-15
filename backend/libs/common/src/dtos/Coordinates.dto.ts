import { ApiProperty } from '@nestjs/swagger'
import { IsLatitude, IsLongitude } from 'class-validator'

export class Coordinates {
  @ApiProperty({ type: Number, example: 0 })
  @IsLatitude()
  lat: number
  @ApiProperty({ type: Number, example: 0 })
  @IsLongitude()
  lng: number
}
