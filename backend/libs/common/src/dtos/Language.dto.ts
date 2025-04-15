import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { LanguageEnumWithouthAll } from '../types'

export class CreateTranslationDto {
  @IsEnum(LanguageEnumWithouthAll)
  @ApiProperty({ enum: LanguageEnumWithouthAll })
  language: string

  @IsString()
  @ApiProperty()
  name: string
}
