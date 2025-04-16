import type {
  ServerRequest,
  ServerResponse,
  WrapperType,
} from '@lib/common/types'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import type { Socket } from 'socket.io'
import { CustomConfigService } from '../config'
import { winstonLogger } from '../utils/winston-logger'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)
  private readonly devMode: boolean = false

  constructor(
    @Inject(CustomConfigService)
    private readonly configService: CustomConfigService,
  ) {
    this.devMode = configService.isDev()
    if (this.devMode) this.logger.debug('Dev mode enabled')
  }

  catch(exception: HttpException & { code?: number }, host: ArgumentsHost) {
    if (host.getType() === 'ws') return this.handleWsException(exception, host)
    return this.handleRestException(exception, host)
  }

  /******************* Websocket Handler *******************/
  private handleWsException(
    exception: HttpException & { code?: number },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToWs()
    const client = ctx.getClient<Socket>()
    const data = ctx.getData()

    // only log 500 errors (Internal Server Error) stacks to avoid cluttering the log.
    if (exception instanceof InternalServerErrorException){
      this.logger.error(
        `Error on ${data.event} from ${client.handshake.headers['user-agent']}\n${exception.message} `,
        exception.stack,
      )
      winstonLogger.error(
        `WS | ${data.event} | ${client.handshake.headers['user-agent']} | ${exception.message}`,
        { stack: exception.stack }
      )
    }
    // only warn 400 and above errors.
    else if (exception.getStatus() >= 400){
      this.logger.warn(
        `Finished ${data.event} from ${client.handshake.headers['user-agent']}\n${exception.message} `,
      )
      winstonLogger.warn(
        `WS | ${data.event} | ${client.handshake.headers['user-agent']} | ${exception.message}`
      )
    }

    const res = exception.getResponse()

    // if (this.appLogService)
    //   this.appLogService.createLog({
    //     ip: client.handshake.address,
    //     method_event: data.event,
    //     path: data.event,
    //     protocol: 'ws',
    //     message: exception.message,
    //     type:
    //       exception instanceof InternalServerErrorException
    //         ? 'error'
    //         : exception.getStatus() >= HttpStatus.BAD_REQUEST
    //           ? 'bad_request'
    //           : 'warn',
    //     payload: {
    //       status: exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
    //       message: exception.message,
    //       stack: exception.stack,
    //       userAgent: client.handshake.headers['user-agent'],
    //     },
    //   })

    if (this.devMode)
      this.logger.debug(
        `Error on ${data.event} from ${client.handshake.headers['user-agent']}\n${exception.message} `,
        exception.stack,
      )
    // incase of valdiation Errors
    return client.emit(data.event, {
      status: exception.getStatus() || 500,
      // Return error payload if it exists
      ...(typeof res === 'string' ? { message: res } : res),
    })
  }

  /******************* Rest Handler *******************/
  private handleRestException(
    exception: HttpException & { code?: number },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<ServerResponse>()
    const request = ctx.getRequest<ServerRequest>()
    const status = exception.getStatus() || 500

    const ip =
      request.headers['fastly-client-ip'] ||
      request.headers['x-forwarded-for'] ||
      request.ip

    const res = exception.getResponse()

    // only log 500 errors (Internal Server Error) stacks to avoid cluttering the log
    if (exception instanceof InternalServerErrorException || status >= 500){
      this.logger.error(
        `Error on ${request.method} ${request.url} ${exception.name} from ${request.headers['user-agent']}\n${exception.message} `,
        exception.stack,
      )
      winstonLogger.error(
        `HTTP | ${request.method} ${request.url} | ${request.headers['user-agent']} | ${exception.message}`,
        { stack: exception.stack }
      )
    }
    // only warn 400 and above errors.
    else if (status >= 400){
      this.logger.warn(
        `Finished ${request.method} ${request.url} ${exception.name} from ${request.headers['user-agent']}\n${exception.message} `,
      )
      winstonLogger.warn(
        `HTTP | ${request.method} ${request.url} | ${request.headers['user-agent']} | ${exception.message}`
      )
    }
    // techincally this should never happen
    else
      this.logger.log(
        `SOMETHING THAT SHOULD NEVER HAPPEN HAPPENED! Finished ${request.method} ${request.url} ${exception.name} from ${request.headers['user-agent']}\n${exception.message} `,
      )

    // if (this.appLogService) {
    //   // Don't block event loop
    //   this.appLogService.createLog({
    //     ip: ip?.toString(),
    //     method_event: request.method,
    //     path: request.url,
    //     protocol: 'http',
    //     message: exception.message,
    //     type:
    //       exception instanceof InternalServerErrorException
    //         ? 'error'
    //         : status >= 400
    //           ? 'bad_request'
    //           : 'warn',
    //     payload: {
    //       status,
    //       message: exception.message,
    //       stack: exception.stack,
    //       userAgent: request.headers['user-agent'],
    //     },
    //   })
    //   this.alertingService.fire(
    //     JSON.stringify({
    //       ip: ip?.toString(),
    //       method_event: request.method,
    //       path: request.url,
    //       protocol: 'http',
    //       requestBody: request.body,
    //       message: exception,
    //     }),
    //   )
    // }

    if (this.devMode)
      this.logger.debug(
        `Error on ${request.method} ${request.url} ${exception.name} from ${request.headers['user-agent']}\n${exception.message} `,
        exception.stack,
      )
    return response.status(status).send({
      statusCode: status,
      // Return error payload if it exists
      ...(typeof res === 'string'
        ? { message: res, error: exception.name }
        : { ...res }),
    })
  }
}
