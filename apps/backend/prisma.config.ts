/**
 * Prisma Configuration - Runtime connection and migration settings.
 *
 * Anchored to the Meterplex Engineering Standard:
 *   - Decouples DATABASE_URL from schema.prisma.
 *   - Centralizes migration and seeding logic.
 *   - Supports dynamic environment resolution for PostgreSQL.
 */
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  /** Path to the Prisma schema file */
  schema: 'prisma/schema.prisma',

  /** Database connection - Essential for Prisma 7 Migrate */
  datasource: {
    url: process.env['DATABASE_URL']!,
    // @ts-expect-error - directUrl is supported by Prisma 7 runtime but missing in current type definitions
    directUrl: process.env['DIRECT_URL']!,
  },

  /** Migration settings including seed command */
  migrations: {
    path: 'prisma/migrations',
    // Seed command - runs via `pnpm db:seed` or after `prisma migrate reset`.
    seed: 'npx tsx prisma/seed.ts',
  },
});
