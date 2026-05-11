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
import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { ChatModule } from './chat/chat.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './modules/health';

@Module({
  imports: [
    // 1. Global Infrastructure (Centralized & Validated)
    ConfigModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    HealthModule,

    // 2. Domain Modules
    AuthModule,
    TaxonomyModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
