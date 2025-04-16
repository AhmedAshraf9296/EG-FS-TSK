import { Module } from '@nestjs/common';
import { AppServicesModule, CustomConfigService, SharedModule } from '@lib/common';
import { UsersModule } from '@lib/common/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from '@lib/common/guards/token/token.guard';
import { RequireUserGuard } from '@lib/common/guards/user/user.guard';

@Module({
  imports: [
    SharedModule,
    UsersModule.forRoot({controller:true}),
    AppServicesModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RequireUserGuard,
    },
  ]
})
export class AppModule {}
  