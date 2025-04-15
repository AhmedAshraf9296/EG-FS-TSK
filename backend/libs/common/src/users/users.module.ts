import { DynamicModule, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserFeature } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { HashService } from '../services/hashing.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      UserFeature
    ]),
  ],
  controllers:[UsersController],
  providers: [UsersService, UsersRepository,HashService ],
})
export class UsersModule {
  static forRoot(options?: { controller?: boolean, repoOnly?: boolean }): DynamicModule {
    if (options?.controller) {
      return {
        module: UsersModule,
        controllers: [UsersController],
        providers: [UsersService, UsersRepository],
        exports: [UsersService, UsersRepository],
      }
    }
    if (options?.repoOnly) {
      return {
        module: UsersModule,
        providers: [UsersRepository],
        exports: [UsersRepository],
      }
    }
    return {
      module: UsersModule,
      providers: [UsersService, UsersRepository],
      exports: [UsersService, UsersRepository],
    }
  }
}


