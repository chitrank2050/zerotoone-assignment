/**
 * IdentityMiddleware - System Identity Provider
 *
 * Pattern: This middleware automatically attaches a default system user to
 * every request. This allows the application to remain identity-aware
 * (essential for database relations) without requiring a full JWT/Auth
 * handshake.
 *
 * It solves the "const userId = 'admin-user-id'" repetition by centralizing
 * the identity logic in the request pipeline.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IdentityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // In a single-user or local tool, we inject the primary admin identity.
    // This makes 'req.user' available for the @CurrentUser decorator.
    (req as any).user = {
      id: 'admin-user-id',
      email: 'admin@example.com',
      role: 'admin',
    };
    next();
  }
}
