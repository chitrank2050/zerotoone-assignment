/**
 * PrismaService - Persistence Connector
 *
 * Manages the connection lifecycle to the LibSQL database via Prisma ORM.
 * Implements OnModuleInit and OnModuleDestroy to ensure clean connection
 * pooling and disconnection during application scaling or shutdown.
 *
 * Adapter: PrismaLibSql (Edge-compatible LibSQL adapter)
 * Context: Used by all domain services for type-safe database mutations.
 */
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

/**
 * PrismaService - Persistence Connector (PostgreSQL)
 *
 * Manages the connection lifecycle to the PostgreSQL database (Neon) via Prisma ORM.
 * Implements OnModuleInit and OnModuleDestroy to ensure clean connection
 * pooling and disconnection during application scaling or shutdown.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL as string,
    });
    const adapter = new PrismaPg(pool);
    // Inject the PostgreSQL adapter into the base PrismaClient
    super({ adapter });
  }

  /**
   * Established DB connection during NestJS module initialization.
   */
  async onModuleInit() {
    this.logger.log('Connecting to PostgreSQL database...');
    await this.$connect();
    this.logger.log('PostgreSQL database connected');
  }

  /**
   * Ensures clean disconnection to prevent connection leaks.
   */
  async onModuleDestroy() {
    this.logger.log('Disconnecting from PostgreSQL database...');
    await this.$disconnect();
    this.logger.log('PostgreSQL database disconnected');
  }
}
