/**
 * PrismaModule - Persistence Layer Core
 *
 * A global module that provides the PrismaService to the entire application.
 * By marking it as @Global(), we ensure that domain modules can use the
 * persistence layer without explicit imports in every file.
 *
 * Standards:
 *   - Provider: PrismaService (LibSQL Adapter)
 *   - Export: Shared globally to ensure a single DB connection instance.
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
