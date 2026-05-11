import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '@common/constants/app';

/**
 * HttpExceptionFilter - Catches ALL exceptions and returns a consistent error response.
 *
 * This filter normalizes ALL errors into one shape:
 *   {
 *     statusCode: 400,
 *     message: "Validation failed",
 *     error: "Bad Request",
 *     correlationId: "abc-123",
 *     timestamp: "2026-03-29T...",
 *     path: "/api/v1/chats"
 *   }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Internal server error';
    if (isHttpException) {
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as Record<string, unknown>)['message'] as
          | string
          | string[];
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    }

    const correlationId =
      (request.headers[CORRELATION_ID_HEADER] as string) ?? 'unknown';

    const errorResponse = {
      success: false,
      data: null,
      error: typeof message === 'string' ? message : message[0],
      metadata: {
        statusCode,
        error: isHttpException
          ? exception.name.replace(/([A-Z])/g, ' $1').trim()
          : 'Internal Server Error',
        correlationId,
        path: request.url,
      },
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= 500) {
      this.logger.error(
        `[${correlationId}] ${request.method} ${request.url} → ${statusCode}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `[${correlationId}] ${request.method} ${request.url} → ${statusCode}: ${JSON.stringify(message)}`,
      );
    }

    response.status(statusCode).json(errorResponse);
  }
}
