import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { CORRELATION_ID_HEADER } from '@common/constants/app';

/**
 * CorrelationIdMiddleware - Attaches a unique ID to every request.
 *
 * Every request gets a UUID in the x-correlation-id header.
 * This ID flows through:
 *   1. Request logs
 *   2. Error responses
 *   3. Response headers
 *
 * This enables end-to-end request tracing across services and debugging logs.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Respect client-provided correlation ID for end-to-end tracing.
    // Generate a new one if the client didn't send one.
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER] as string) || randomUUID();

    // Set it on the request so downstream code can read it.
    req.headers[CORRELATION_ID_HEADER] = correlationId;

    // Set it on the response so the client can see it.
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
