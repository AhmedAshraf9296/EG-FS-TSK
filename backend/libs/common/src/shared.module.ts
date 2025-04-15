import { DatabaseModule } from '@db'
import { ConfigModule } from '@lib/common/config'
import { HttpExceptionFilter, MongooseErrorFilter } from '@lib/common/filters'
import { LoggerInterceptor } from '@lib/common/interceptors'
import { Global, Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongooseErrorFilter,
    },
  ],
})
@Global()
export class SharedModule {}
