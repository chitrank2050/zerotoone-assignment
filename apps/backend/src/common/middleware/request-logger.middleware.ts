import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '@common/constants/app';

/**
 * RequestLoggerMiddleware - Logs every incoming request and its response time.
 *
 * Output for every request:
 *   [RequestLogger] [abc-123] GET /api/v1/chat/sessions → 200 (45ms)
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, originalUrl } = req;
    const correlationId = req.headers[CORRELATION_ID_HEADER] as string;

    // Skip health checks to keep logs clean
    if (originalUrl === '/health') {
      return next();
    }

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const message = `[${correlationId}] ${method} ${originalUrl} → ${statusCode} (${duration}ms)`;

      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
