import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  Optional,
  StreamableFile,
} from '@nestjs/common'
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils'
import { HttpAdapterHost, Reflector } from '@nestjs/core'
import type { Cache } from 'cache-manager'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { LanguageHeader } from '../config/keys'
import { ServerRequest, ServerRequestWithUser } from '../types'

export const CACHE_MANAGER = 'CACHE_MANAGER'
export const CACHE_KEY_METADATA = 'cache_module:cache_key'
export const CACHE_TTL_METADATA = 'cache_module:cache_ttl'

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  @Optional()
  @Inject()
  protected readonly httpAdapterHost: HttpAdapterHost

  protected allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    protected readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context)
    // eslint-disable-next-line @typescript-eslint/ban-types
    const ttlValueOrFactory: number | Function | null =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
      this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ??
      null

    if (!key) {
      return next.handle()
    }
    try {
      const value = await this.cacheManager.get(key)
      const req = context.switchToHttp().getRequest<ServerRequest>()

      let useCache = true
      // Check to see if request is cacheable
      if (
        req.headers['no-cache'] === 'true' ||
        req.headers['cache-control']?.includes('no-cache')
      ) {
        useCache = false
      }
      if (req.method !== 'GET') {
        useCache = false
      }
      if (isNil(value)) {
        useCache = false
      }

      if (useCache) {
        Logger.debug(`Cache Hit "key: ${key}"`, 'CacheInterceptor')
        return of(value)
      }
      Logger.debug(
        `Cache Miss. Ignore Cache: ${useCache} "key: ${key}"`,
        'CacheInterceptor',
      )

      const ttl: number | null = isFunction(ttlValueOrFactory)
        ? await ttlValueOrFactory(context)
        : ttlValueOrFactory

      return next.handle().pipe(
        tap(async response => {
          if (response instanceof StreamableFile) {
            return
          }

          const args: Parameters<Cache['set']> = [key, response]
          if (!isNil(ttl)) {
            args.push(ttl)
          } else {
            args.push(1000 * 60)
          }

          try {
            if (req.method !== 'GET') {
              const keys = await this.cacheManager.store.keys()
              await Promise.all(
                keys.map(async k => {
                  if (k.includes(key)) {
                    await this.cacheManager.del(k)
                  }
                }),
              )
            } else {
              await this.cacheManager.set(...args)
            }
          } catch (err) {
            Logger.error(
              `An error has occurred when inserting "key: ${key}", "value: ${response}"`,
              err.stack,
              'CacheInterceptor',
            )
          }
        }),
      )
    } catch (err) {
      Logger.error(
        `An error has occurred when acquring "key: ${key}"`,
        err.stack,
        'CacheInterceptor',
      )
      return next.handle()
    }
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod
    const cacheMetadata = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    )

    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata
    }

    if (!this.isRequestCacheable(context)) {
      return undefined
    }
    const request = context.getArgByIndex(0)
    // Also cache by language
    const language = this.extractLanguage(request)
    return language
      ? httpAdapter.getRequestUrl(request) + language
      : httpAdapter.getRequestUrl(request)
  }

  extractLanguage(request: ServerRequest): string | undefined {
    return request.headers[LanguageHeader]?.toString()
  }

  extractUser(request: ServerRequestWithUser): string | undefined {
    return request.user?.sub
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<ServerRequest>()
    return this.allowedMethods.includes(req.method)
  }
}

@Injectable()
export class DefaultCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<ServerRequest>()
    if (
      req.headers['no-cache'] === 'true' ||
      req.headers['cache-control']?.includes('no-cache')
    ) {
      return false
    }
    return this.allowedMethods.includes(req.method)
  }
}

@Injectable()
export class CustomCacheInterceptorUsingUser extends CustomCacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const key = super.trackBy(context)
    if (!key) {
      return key
    }
    return key + 'user=' + this.extractUser(context.switchToHttp().getRequest())
  }
}
