import { ConfigModule } from '@lib/common/config'
import { HashService } from '@lib/common/services/hashing.service'
import { JwtService } from '@lib/common/services/jwt.service'

import { DynamicModule, Module } from '@nestjs/common'

const ServiceMap: Record<string, NonNullable<DynamicModule['providers']>[0]> = {
  HashService,
  JwtService,
} as const

type ServiceMap = (typeof ServiceMap)[keyof typeof ServiceMap]

const imports = [
  ConfigModule,
]

@Module({
  imports,
})
export class AppServicesModule {
  static forRoot(): DynamicModule {
    const services = Object.values(ServiceMap)
    return {
      module: AppServicesModule,
      imports: imports,
      providers: services,
      exports: services,
    }
  }

  static forFeature(key: string | string[]): DynamicModule {
    if (Array.isArray(key)) {
      const services = key.filter(k => k in ServiceMap).map(k => ServiceMap[k])
      if (services.length === 0) {
        throw new Error(`Services ${key.join(',')} not found`)
      }
      return {
        module: AppServicesModule,
        imports,
        providers: services,
        exports: services,
      }
    }

    if (key in ServiceMap) {
      return {
        module: AppServicesModule,
        imports,
        providers: [ServiceMap[key]],
        exports: [ServiceMap[key]],
      }
    }
    throw new Error(`Service ${key} not found`)
  }
}
