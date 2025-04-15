import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Ashraf' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'ahmed.ashraf@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: '+201152875815' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: 'strongPassword123!' })
  @IsString()
  @IsNotEmpty()
  password: string
}
