import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export type ApiEnvelope<T> = {
  data: T;
  meta: Record<string, unknown>;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiEnvelope<T> | T> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiEnvelope<T> | T> {
    const request = context.switchToHttp().getRequest<{ url?: string }>();
    const url = request.url ?? '';
    const isHealth = url === '/health' || url.startsWith('/api/v1/health');

    return next.handle().pipe(
      map((data) => {
        if (isHealth) {
          return data;
        }
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          return data as unknown as ApiEnvelope<T>;
        }
        return {
          data,
          meta: {},
        };
      }),
    );
  }
}
