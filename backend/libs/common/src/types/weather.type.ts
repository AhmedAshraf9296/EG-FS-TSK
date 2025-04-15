import { ApiProperty } from '@nestjs/swagger'

export class WeatherResponseClass {
  @ApiProperty({ type: Date })
  date: Date | string
  @ApiProperty()
  temperature: number
  @ApiProperty()
  description: string
  @ApiProperty()
  wind: number
  @ApiProperty()
  wind_unit: string
  @ApiProperty()
  @ApiProperty({
    enum: [
      'North',
      'South',
      'East',
      'West',
      'North-East',
      'North-West',
      'South-East',
      'South-West',
    ],
  })
  wind_direction:
    | 'North'
    | 'South'
    | 'East'
    | 'West'
    | 'North-East'
    | 'North-West'
    | 'South-East'
    | 'South-West'
  @ApiProperty()
  pressure: number
  @ApiProperty()
  pressure_unit: string
  @ApiProperty()
  precipitation: number
  @ApiProperty()
  precipitation_unit: string
  @ApiProperty()
  humidity: number
  @ApiProperty()
  humidity_unit: string
  @ApiProperty()
  cloud: number
  @ApiProperty()
  feels_like: number
  @ApiProperty()
  feels_like_unit: string
  @ApiProperty()
  visibility: number
  @ApiProperty()
  visibility_unit: string
  @ApiProperty()
  uv: number
  @ApiProperty()
  gust: number
  @ApiProperty()
  gust_unit: string
  @ApiProperty()
  high_temperature: number
  @ApiProperty()
  low_temperature: number
}

export type WeatherResponse = {
  date: string
  temperature: number
  high_temperature: number
  low_temperature: number
  description: string
  wind: number
  wind_unit: string
  wind_direction:
    | 'North'
    | 'South'
    | 'East'
    | 'West'
    | 'North-East'
    | 'North-West'
    | 'South-East'
    | 'South-West'
  pressure: number
  pressure_unit: string
  precipitation: number
  precipitation_unit: string
  humidity: number
  humidity_unit: string
  cloud: number
  feels_like: number
  feels_like_unit: string
  visibility: number
  visibility_unit: string
  uv: number
  gust: number
  gust_unit: string
}
