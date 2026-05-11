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
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL as string,
    });
    // Inject the LibSQL adapter into the base PrismaClient
    super({ adapter });
  }

  /**
   * Established DB connection during NestJS module initialization.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Ensures clean disconnection to prevent connection leaks.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
