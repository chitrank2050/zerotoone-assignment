/**
 * Prisma Configuration - Runtime connection and migration settings.
 *
 * Anchored to the Meterplex Engineering Standard:
 *   - Decouples DATABASE_URL from schema.prisma.
 *   - Centralizes migration and seeding logic.
 *   - Supports dynamic environment resolution for LibSQL/SQLite.
 */
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  /** Path to the Prisma schema file */
  schema: 'prisma/schema.prisma',

  /** Migration settings including seed command */
  migrations: {
    path: 'prisma/migrations',

    // Seed command - runs via `pnpm db:seed` or after `prisma migrate reset`.
    seed: 'npx tsx prisma/seed.ts',
  },

  /** Database connection - reads DATABASE_URL from environment */
  datasource: {
    url: process.env['DATABASE_URL']!,
  },
});
