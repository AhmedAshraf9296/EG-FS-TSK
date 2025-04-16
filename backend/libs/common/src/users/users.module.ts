
import { DynamicModule, Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UserFeature } from './entities/user.entity'
import { UsersRepository } from './users.repository'
import { HashService } from '../services/hashing.service'

const imports = [
  MongooseModule.forFeature([
    UserFeature,
  ]),
]
const providers = [
  UsersService,
  UsersRepository,
  HashService
]
const moduleExports = providers

@Module({
  imports,
  providers,
  exports: moduleExports,
})
export class UsersModule {
  static forRoot({
    controller = false,
    repoOnly = false,
  }: {
    controller?: boolean
    repoOnly?: boolean
  }): DynamicModule {
    if (repoOnly) {
      return {
        module: UsersModule,
        providers: [UsersRepository],
        exports: [UsersRepository],
      }
    }

    return {
      module: UsersModule,
      ...(controller && { controllers: [UsersController] }),
      providers,
      exports: moduleExports,
    }
  }
}
