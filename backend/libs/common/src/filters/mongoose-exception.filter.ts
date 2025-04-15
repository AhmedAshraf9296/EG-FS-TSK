import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { MongoServerError } from 'mongodb'
import { Error as MongooseError } from 'mongoose'
import type { ServerRequest, ServerResponse } from '../types'

const messagesLookupTable = {
  [MongooseError.ValidationError.name]: HttpStatus.BAD_REQUEST,
  [MongooseError.CastError.name]: HttpStatus.BAD_REQUEST,
  [MongooseError.DocumentNotFoundError.name]: HttpStatus.NOT_FOUND,
  [MongooseError.VersionError.name]: HttpStatus.CONFLICT,
  [MongooseError.ParallelSaveError.name]: HttpStatus.CONFLICT,
  [MongoServerError.name]: HttpStatus.BAD_REQUEST,
  default: HttpStatus.INTERNAL_SERVER_ERROR,
}

@Catch(MongooseError, MongoServerError)
export class MongooseErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongooseErrorFilter.name)

  catch(
    exception: (MongooseError | MongoServerError) & { code?: number },
    host: ArgumentsHost,
  ) {
    return this.handleRestException(exception, host)
  }

  /******************* Rest Handler *******************/
  private handleRestException(
    exception: MongooseError | MongoServerError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<ServerResponse>()
    const request = ctx.getRequest<ServerRequest>()
    const status =
      messagesLookupTable[exception.name] || messagesLookupTable.default

    this.logger.error(
      `Error on ${request.method} ${request.url} ${exception.name} from ${request.headers['user-agent']}\n${exception.message} `,
      exception.stack,
    )
   
    return response.status(status).send({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    })
  }
}
