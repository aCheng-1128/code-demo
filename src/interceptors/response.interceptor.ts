import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Injectable()
class ResTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        return {
          code: statusCode,
          data: data?.data || data,
          msg: data?.msg || '',
          status: statusCode < 400 ? 'success' : 'error',
        };
      }),
    );
  }
}

export const ResInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: ResTransformInterceptor,
};
