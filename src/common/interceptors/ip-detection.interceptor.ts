import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class IpDetectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.ip) {
      (request as any).clientIp = request.connection.remoteAddress || 'unknown';
    } else {
      (request as any).clientIp = request.ip;
    }

    return next.handle();
  }
} 