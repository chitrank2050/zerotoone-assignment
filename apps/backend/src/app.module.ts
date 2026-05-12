/**
 * AppModule - Monorepo Root Entry Point
 *
 * The central orchestrator for the Audience Builder backend.
 * Responsible for assembling the modular monolith by importing domain-specific
 * modules and establishing global infrastructure (Configuration, Persistence).
 *
 * Module Graph:
 *   - ConfigModule (Global): Environment variable management.
 *   - PrismaModule (Global): Shared data access layer.
 *   - AuthModule: Identity & Access Management.
 *   - TaxonomyModule: Targeting signal management.
 *   - ChatModule: AI engine (Gemini) orchestration.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from '@modules/auth/auth.module';
import { ChatModule } from '@modules/chat/chat.module';
import { ConfigModule } from '@modules/config/config.module';
import { HealthModule } from '@modules/health';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { TaxonomyModule } from '@modules/taxonomy/taxonomy.module';
import { CacheCustomModule } from '@modules/cache/cache.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

@Module({
  imports: [
    // Global Infrastructure (Centralized & Validated)
    ConfigModule,
    PrismaModule,
    HealthModule,
    CacheCustomModule,

    // Domain Modules
    AuthModule,
    TaxonomyModule,
    ChatModule,

    // Security: Rate Limiting (DDoS Protection)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Register global middleware.
   * CorrelationIdMiddleware must run first to ensure the ID is available
   * for any logs or errors that occur during the request lifecycle.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CorrelationIdMiddleware, RequestLoggerMiddleware)
      .forRoutes('*path');
  }
}
