import { ConfigModule, CustomConfigService } from '@lib/common'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DatabaseService } from './db.service'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: CustomConfigService) => ({
        uri: configService.getMongoDb(),
      }),
      imports: [ConfigModule],
      inject: [CustomConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
