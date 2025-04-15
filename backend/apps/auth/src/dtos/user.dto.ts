
import { Coordinates } from '@lib/common/dtos/Coordinates.dto'
import { User } from '@lib/common/users/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  isEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { Types } from 'mongoose'

export class SignUpUserDTO implements Partial<User> {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    required: true,
  })
  name: string

  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @ApiProperty({ required: true })
  email: string
  
  @IsString()
  @IsPhoneNumber()
  @ApiProperty({
    required: true,
    description: 'phone of the user, MUST have country code',
  })
  phone: string


  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one letter, one number, and one special character',
  })
  @MaxLength(20)
  @ApiProperty({
    description: 'User password',
    example: 'Passw0rd!',
    minLength: 8,
    maxLength: 20,
    required: true,
  })
  password: string;
}

export class LoginUserWithEmailDTO implements Partial<User> {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty()
  password: string
}

