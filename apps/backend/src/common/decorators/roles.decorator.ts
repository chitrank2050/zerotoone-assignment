import { SetMetadata } from '@nestjs/common';

/**
 * Roles - Authorization Decorator
 *
 * Pattern: Metadata-based authorization. This decorator attaches a list of
 * required roles to a route handler, which is later intercepted by the
 * RolesGuard to enforce permission checks.
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
