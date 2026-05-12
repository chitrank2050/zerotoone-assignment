import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  /**
   * Checks database connectivity by executing a trivial query.
   *
   * @param key - The name shown in the health check response (e.g., "database")
   * @returns Health indicator result with status "up" or "down"
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    // .check(key) returns an indicator object with .up() and .down() methods.
    const indicator = this.healthIndicatorService.check(key);

    try {
      // SELECT 1 is the lightest possible database check.
      // Tests the full path: connection pool → network → PostgreSQL (Neon) → response.
      await this.prisma.$queryRaw`SELECT 1`;
      return indicator.up();
    } catch (error) {
      // .down() includes error details in the health check response body.
      // The HealthCheckService in the controller catches this and returns 503.
      return indicator.down({ message: (error as Error).message });
    }
  }
}
