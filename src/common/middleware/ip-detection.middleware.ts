import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpDetectionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ipHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'cf-connecting-ip',
      'x-forwarded',
      'forwarded-for',
      'forwarded',
    ];

    let clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    if (clientIp === '::' || clientIp === '::1') {
      clientIp = '127.0.0.1';
    }
    if (clientIp.includes(':')) {
      clientIp = clientIp.split(':')[0];
    }

    for (const header of ipHeaders) {
      const value = req.headers[header];
      if (value) {
        const ips = Array.isArray(value) ? value[0] : value;
        const firstIp = ips.split(',')[0].trim();
        
        if (this.isValidIp(firstIp)) {
          clientIp = firstIp;
          break;
        }
      }
    }

    (req as any).clientIp = clientIp;
    
    next();
  }

  private isValidIp(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipv4Regex.test(ip)) {
      return true;
    }
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip) && ip !== '::' && ip !== '::1';
  }
} 