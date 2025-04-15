import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from '@lib/common/app';


bootstrap(AppModule, {
  portEnvName: 'CLIENT_PORT'
})