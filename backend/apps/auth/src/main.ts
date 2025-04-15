import { bootstrap } from '@lib/common/app'
import { AuthModule } from './auth.module'

bootstrap(AuthModule, {
  portEnvName: 'AUTH_PORT',
})
