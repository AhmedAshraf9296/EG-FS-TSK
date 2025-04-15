import { CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { LogAppInterceptor } from './log.interceptor'

describe('LogInterceptor', () => {
  const appLogService = {
    createLog: jest.fn(),
  } as any

  it('should be defined', () => {
    expect(new LogAppInterceptor(appLogService)).toBeDefined()
  })

  it('should call appLogger when intercept is done', () => {
    const interceptor = new LogAppInterceptor(appLogService)
    const request = {
      url: 'http://localhost:3000/v1/movies',
      method: 'GET',
      headers: {
        'fastly-client-ip': 'IP',
        'user-agent': 'Test user-agent',
        host: 'localhost:3000',
      },
    } as any
    const response = { statusCode: 200 } as any

    const getRequest = jest.fn(() => request)
    const getResponse = jest.fn(() => response)

    const context = {
      getClass: () => ({
        name: 'MoviesController',
      }),
      getHandler: () => ({
        name: 'getMovies',
      }),
      switchToHttp: () => ({
        getRequest,
        getResponse,
      }),
    }

    const callHandler: CallHandler = {
      handle: () => {
        return new Observable(subscriber => {
          subscriber.next()
          subscriber.complete()
        })
      },
    }

    const obs = interceptor.intercept(context as any, callHandler as any)
    obs.subscribe(data => {
      expect(data).toBeUndefined()
      expect(getRequest).toHaveBeenCalled()
      expect(getResponse).toHaveBeenCalled()
      expect(appLogService.createLog).toHaveBeenCalledWith({
        userId: undefined,
        method_event: 'GET',
        path: 'http://localhost:3000/v1/movies',
        message: 'MoviesController.getMovies',
        protocol: 'http',
        type: 'info',
        ip: 'IP',
        payload: {
          userAgent: 'Test user-agent',
          status: 200,
        },
      })
    })
  })
})
