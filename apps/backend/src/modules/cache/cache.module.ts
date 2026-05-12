import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CACHE_TTL } from '@common/constants/app';

/**
 * CacheCustomModule - Centralized Caching Infrastructure
 *
 * Provides a globally available caching service:
 *   - Strategy: In-Memory for high-performance local and production workloads.
 *
 * Configured as a @Global() module to allow easy injection of CACHE_MANAGER
 * across all domain modules (Taxonomy, Chat, etc.).
 */
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        // Using In-Memory fallback as primary for zero-setup local development
        return {
          ttl: CACHE_TTL,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheCustomModule {}
