import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { getWinstonConfig } from '@modules/config/logger.config';
import { API_PREFIX, API_VERSION } from '@common/constants/app';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

/**
 * AI Audience Builder - Backend Entry Point
 *
 * Orchestrates the bootstrapping of the NestJS application, configuring
 * global security, validation, and connectivity settings.
 */
async function bootstrap(): Promise<void> {
  const ENV = process.env.NODE_ENV ?? 'development';

  //  Initialize NestJS Application with the root AppModule Initialize NestJS Application with the root AppModule
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(getWinstonConfig(ENV)),
  });

  app.use(
    helmet({
      // Scalar loads JS/CSS from CDN - default CSP blocks it.
      // Disabled in dev (where Scalar runs), enabled in prod (where it doesn't).
      contentSecurityPolicy: ENV === 'production',
    }),
  );

  app.use(compression());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.setGlobalPrefix(API_PREFIX, {
    exclude: ['health'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Interceptors & Filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  if (ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('AI Audience Builder API')
      .setDescription(
        'The core API for orchestrating AI-driven audience segmentation.',
      )
      .setVersion(API_VERSION)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    // Raw OpenAPI JSON - importable by Bruno, Postman, SDK generators.
    SwaggerModule.setup(`${API_PREFIX}/swagger`, app, document, {
      jsonDocumentUrl: `${API_PREFIX}/docs-json`,
    });

    // Scalar UI - modern interactive API docs replacing Swagger UI.
    // Dynamic import avoids CJS/ESM compatibility issues.
    const { apiReference } = await import('@scalar/nestjs-api-reference');
    app.use(
      `/${API_PREFIX}/docs`,
      apiReference({
        content: document,
        theme: 'purple',
      }),
    );
  }

  // Enable Graceful Shutdown hooks
  app.enableShutdownHooks();

  // 5. Start the server on the configured port
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`
  ┌──────────────────────────────────────────────┐
  │  AI Audience Builder API running             │
  │  Local:   http://localhost:${String(port).padEnd(4)}              │
  │  Docs:    http://localhost:${String(port).padEnd(4)}/api/docs     │
  │  Health:  http://localhost:${String(port).padEnd(4)}/health       │
  │  Mode:    ${String(ENV ?? 'development').padEnd(35)}│
  └──────────────────────────────────────────────┘
  `);
}

void bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
