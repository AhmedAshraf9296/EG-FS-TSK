import fastifyCookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import { CustomConfigService } from '@lib/common/config'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { contentParser } from 'fastify-multer'
import { addSwaggerDocsToServer } from './helpers/swagger.helper'
// For hot reloading ignore.
declare const module: any

// Function overloads
export async function bootstrap(
  AppModule: unknown,
  options?: {
    dontListen?: true
    beforeListen?: (app: NestFastifyApplication) => void
    portEnvName?: string // Example: 'ADMIN_PORT'
    globalPrefix?: string
    servers?: {
      description: string
      url: string
    }[]
  },
): Promise<{
  app: NestFastifyApplication
  port: number | string
}>

export async function bootstrap(
  AppModule: unknown,
  options?: {
    dontListen?: boolean
    beforeListen?: (app: NestFastifyApplication) => void
    portEnvName?: string // Example: 'ADMIN_PORT'
    globalPrefix?: string
    servers?: {
      description: string
      url: string
    }[]
  },
): Promise<{
  app: NestFastifyApplication
  port: number | string
} | void> {
  // fireup
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 1048576 * 50 }), // 50MB
  )
  // logger
  const logger = new Logger('Bootstrap')
  // config
  const configService = app.get(CustomConfigService)
  // If a port env name was passed, use it, otherwise use the default name from the config
  const port = options?.portEnvName
    ? configService.get(options.portEnvName, '8080') ?? configService.getPort() // In case the name env port is not defined in the config
    : configService.getPort()

  // Starts listening for shutdown hooks
  app.enableShutdownHooks()
  // logging level
  app.useLogger(
    configService.isDev()
      ? ['log', 'debug', 'error', 'warn', 'verbose', 'fatal']
      : ['log', 'warn', 'error', 'fatal'],
  )

  // Security
  app.register(helmet, {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })

  app.register(contentParser)

  // enable cors
  app.enableCors({
    credentials: true,
    origin: true,
  })

  // For parsing cookies from the request
  app.register(fastifyCookie, {
    secret: configService.getCookieSecret(),
  })

  // prefix
  if (options?.globalPrefix) {
    app.setGlobalPrefix(options.globalPrefix)
  }

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  //// swagger docs
  if (configService.isDev()) {
    addSwaggerDocsToServer(app, {
      globalPrefix: options?.globalPrefix,
      port: Number(port),
      servers: options?.servers,
    })
  }

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      enableDebugMessages: configService.isDev(),
      disableErrorMessages: false,
    }),
  )

  const fastifyInstance = app.getHttpAdapter().getInstance()

  fastifyInstance
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .addHook('onRequest', async (req, _res) => {
      ;(req.socket as any)['encrypted'] = true
    })
    .decorateReply('setHeader', function (name: string, value: unknown) {
      this.header(name, value)
    })
    .decorateReply('end', function () {
      this.send('')
    })

  if (options?.dontListen) {
    return { app, port }
  }

  if (options?.beforeListen) {
    options.beforeListen(app)
  }

  // start
  await app.listen(port, '0.0.0.0', async () => {
    logger.log(`🚀 Server ready at ${await app.getUrl()}`)
  })

  // hot module replace for dev
  if (module.hot) {
    try {
      module.hot.accept()
      module.hot.dispose(() => app.close())
    } catch (err) {
      console.error(err)
    }
  }
  return
}

process.on('unhandledRejection', (error: Error, promise) => {
  const logger = new Logger('UnhandledRejection')
  logger.error(
    `Unhandled Rejection at: ${
      promise instanceof Promise ? promise : JSON.stringify(promise)
    }, reason: ${error}`,
    error.stack,
  )
})

process.on('uncaughtException', error => {
  const logger = new Logger('UncaughtException')
  logger.error(
    `Uncaught Exception at: ${error}
${error.stack}
`,
    error,
  )
})
