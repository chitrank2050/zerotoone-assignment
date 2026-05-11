import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

/**
 * AI Audience Builder - Backend Entry Point
 *
 * Orchestrates the bootstrapping of the NestJS application, configuring
 * global security, validation, and connectivity settings.
 */
async function bootstrap() {
  // 1. Initialize NestJS Application with the root AppModule
  const app = await NestFactory.create(AppModule);

  // 2. Global Security & Performance Middleware
  app.use(helmet());
  app.use(compression());

  // 3. Global Security: Enable CORS for Frontend communication
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable Graceful Shutdown hooks
  app.enableShutdownHooks();

  /**
   * 3. Principal-Grade Data Integrity
   * We enforce strict validation pipes at the API boundary to ensure that
   * only well-formed DTOs are processed by the business logic.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties from DTOs
      forbidNonWhitelisted: true, // Throw error if non-whitelisted props are sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // 4. Start the server on the configured port
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(
    `[🚀] AI Audience Builder Backend is live at: http://localhost:${port}`,
  );
  console.log(`[🧪] Environment: ${process.env.NODE_ENV || 'development'}`);
}

// Fire and forget the bootstrap sequence
void bootstrap();
