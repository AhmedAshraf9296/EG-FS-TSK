import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'

@Catch()
export class HttpErrorsToWsErrorsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(new WsException(exception.getResponse()), host)
    }
    return super.catch(exception, host)
  }
}
