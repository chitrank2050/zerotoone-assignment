import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard - Route Shield
 *
 * Use this guard on controllers or specific endpoints to require
 * a valid JWT.
 *
 * Example:
 *   @UseGuards(JwtAuthGuard)
 *   @Get('profile')
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
