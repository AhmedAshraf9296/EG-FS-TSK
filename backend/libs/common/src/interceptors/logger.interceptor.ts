import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { tap } from 'rxjs'
import type { Socket } from 'socket.io'
import type { ServerRequest, ServerResponse } from '../types'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name)

  // Interceptor
  intercept(context: ExecutionContext, next: CallHandler) {
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        // check if request is from websocket
        if (context.getType() === 'ws') {
          return this.logNextWs(context, start)
        }
        return this.logNextRest(context, start)
      }),
    )
  }

  // Websocket
  logNextWs(context: ExecutionContext, start: number) {
    const ctx = context.switchToWs()
    const client = ctx.getClient<Socket>()
    const event = ctx.getPattern()
    const delta = Date.now() - start // ms

    const log = `${new Date().toISOString()} Socket event ${event} - client ${
      client.id
    } took ${delta}ms from ${client.handshake.address} using ${
      client.handshake.headers['user-agent']
    }`

    return this.logger.log(log)
  }

  // Restful Api
  logNextRest(context: ExecutionContext, start: number) {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse<ServerResponse>()
    const request = ctx.getRequest<ServerRequest>()
    const delta = Date.now() - start

    const ip =
      request.headers['fastly-client-ip'] ||
      request.headers['x-forwarded-for'] ||
      request.ip

    const log = `${new Date().toISOString()} ${request.method} ${
      request.url
    } status ${response.statusCode} took ${delta}ms from ${ip} / ${
      request.headers['host']
    } using ${request.headers['user-agent']}`

    return response.statusCode >= 400
      ? response.statusCode > 499
        ? this.logger.error(log)
        : this.logger.warn(log)
      : this.logger.log(log)
  }
}
