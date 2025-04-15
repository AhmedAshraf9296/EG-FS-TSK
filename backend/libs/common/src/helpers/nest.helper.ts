import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { AbstractHttpAdapter } from '@nestjs/core'
import { ServerResponse } from '../types'
import { ExecutionContextToAbstractResponsePipe } from '../validators-and-pipes/ctx-to-abstract-response.pipe'

export class AbstractResponse {
  // Note that this isn't a provider
  httpCtx: HttpArgumentsHost

  constructor(
    private readonly httpAdapter: AbstractHttpAdapter,
    readonly executionContext: ExecutionContext,
  ) {
    this.httpCtx = executionContext.switchToHttp()
  }

  /** Define the HTTP header on the supplied response object. */
  setHeader(name: string, value: string): this {
    this.httpAdapter.setHeader(
      this.httpCtx.getResponse<ServerResponse>(),
      name,
      value,
    )
    return this
  }

  /** Define the HTTP status code on the supplied response object. */
  setStatus(statusCode: number): this {
    this.httpAdapter.status(
      this.httpCtx.getResponse<ServerResponse>(),
      statusCode,
    )
    return this
  }

  /** Define the Cookie on the supplied response object. */
  setCookie(
    name: string,
    value: string,
    options: Parameters<ServerResponse['setCookie']>[2] = {},
  ): this {
    this.httpCtx.getResponse<ServerResponse>().setCookie(name, value, options)
    return this
  }

  /** get Cookie from the supplied request object. */
  getCookie(name: string): string | undefined {
    return this.httpCtx.getRequest<ServerResponse>().cookies[name]
  }
}

const GetExecutionContext = createParamDecorator(
  (_: never, ctx: ExecutionContext): ExecutionContext => ctx,
)

export const GenericResponse = (): ParameterDecorator =>
  GetExecutionContext(ExecutionContextToAbstractResponsePipe)

export type GenericResponse = AbstractResponse
