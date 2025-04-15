import { AppServicesModule, JwtService } from '@lib/common/services'

import { DynamicModule, Module } from '@nestjs/common'
import { AuthService } from './auth.service'

const services = [
  {
    name: AuthService.name,
    provide: AuthService,
    useFactory: ( jwtService: JwtService) => {
      return new AuthService(jwtService)
    },
    inject: [ JwtService],
  },
]

// create a type of services name.
type ServicesName = (typeof services)[number]['name']

@Module({
  imports: [
    AppServicesModule.forFeature([JwtService.name]),
  ],
  providers: [],
  exports: [],
})
export class DomainModule {
  static forRoot(options: {
    [key in ServicesName]: boolean
  }): DynamicModule {
    const servicesToProvideAndExport = services.filter(
      service => options[service.name],
    )

    return {
      module: DomainModule,
      providers: servicesToProvideAndExport,
      exports: servicesToProvideAndExport,
    }
  }
}
