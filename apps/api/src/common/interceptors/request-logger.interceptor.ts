import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import type { Request } from "express";
import { tap } from "rxjs/operators";

// nest g interceptor nombre-interceptor --flat

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startedAt;
          this.logger.log(
            `${request.method} ${request.url} completed in ${duration}ms`,
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startedAt;
          this.logger.error(
            `${request.method} ${request.url} failed in ${duration}ms: ${error.message}`,
          );
        },
      }),
    );
  }
}
