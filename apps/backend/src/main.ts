import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  // 2. Global Security: Enable CORS for Frontend communication
  // In production, this should be restricted to specific origins
  app.enableCors();

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
