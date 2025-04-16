import { ConfigModule, SharedModule } from '@lib/common'
import { AppServicesModule } from '@lib/common/services'
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginController } from './login.controller'
import { SignupController } from './signup.controller'
import { UsersModule } from '@lib/common/users/users.module'

@Module({
  imports: [
    SharedModule,
    UsersModule.forRoot({controller:false}),
    AppServicesModule.forRoot(),
    ConfigModule,
  
  ],
  controllers: [
    LoginController,
    SignupController,
  ],
  providers: [
    AuthService
  ],
  exports: [],
})
export class AuthModule {}
