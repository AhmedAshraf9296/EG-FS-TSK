import { Expose, plainToInstance } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator'

export const APP_ENV = {
  DEV: 'DEV',
  PROD: 'PROD',
}

// create a class transformer to transform the config object
class EnvTransformer {
  //// App Env ////
  @IsEnum(APP_ENV)
  @Expose({ name: 'APP_ENV' })
  APP_ENV: 'DEV' | 'PROD'

  @Expose()
  @IsNumberString()
  @IsOptional()
  CLIENT_PORT: string

  @Expose()
  @IsNumberString()
  @IsOptional()
  ADMIN_PORT: string

  @Expose()
  @IsNumberString()
  @IsOptional()
  AUTH_PORT: string

  @Expose()
  @IsNumberString()
  @IsOptional()
  PORT: string

  //// DB ////
  @IsString()
  @Expose()
  @IsNotEmpty()
  MONGO_DB: string

  @IsString()
  @Expose()
  @IsNotEmpty()
  JWT_SECRET: string
  
  @Expose()
  @IsString()
  @IsOptional()
  COOKIE_SECRET: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvTransformer, config, {
    excludeExtraneousValues: true,
  })

  const errors = validateSync(validatedConfig)
  if (errors.length) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
