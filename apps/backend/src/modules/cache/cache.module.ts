import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

/**
 * CacheCustomModule - Centralized Caching Infrastructure
 *
 * Provides a globally available caching service with a hybrid strategy:
 *   - Production: Redis (Upstash) for persistent, distributed caching.
 *   - Development: In-Memory for zero-setup local development.
 *
 * Configured as a @Global() module to allow easy injection of CACHE_MANAGER
 * across all domain modules (Taxonomy, Chat, etc.).
 */
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        if (redisUrl) {
          return {
            store: await redisStore({
              url: redisUrl,
              ttl: 3600000, // Default 1 hour
            }),
          };
        }

        // Fallback for local development
        return {
          ttl: 3600000,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheCustomModule {}
