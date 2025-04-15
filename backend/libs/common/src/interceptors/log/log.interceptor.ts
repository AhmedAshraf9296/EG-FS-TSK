import { TokenPayload, WrapperType } from '@lib/common/types'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LogAppInterceptor implements NestInterceptor {
  constructor(
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest()
        const res = context.switchToHttp().getResponse()
        const tokenPayload = req.user as TokenPayload
        const ip =
          req.headers['fastly-client-ip'] ||
          req.headers['x-forwarded-for'] ||
          req.ip

        // Get controller name and method name
        const controller = context.getClass().name
        const handler = context.getHandler().name
        // this.appLogService.createLog({
        //   userId: tokenPayload?.sub,
        //   method_event: req.method as string,
        //   path: req.url,
        //   message: `${controller}.${handler}`,
        //   protocol: 'http',
        //   type: res.statusCode < 210 ? 'info' : 'bad_request',
        //   ip: ip as string,
        //   payload: {
        //     userAgent: req.headers['user-agent'],
        //     status: res.statusCode,
        //   },
        // })
      }),
    )
  }
}
