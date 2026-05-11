/**
 * AuthService - Identity & Access Orchestrator
 *
 * Handles the authentication lifecycle and secure credential validation.
 * Responsible for issuing JWTs and establishing user context for the platform.
 *
 * Standards:
 *   - Auth Strategy: JWT (Stateless)
 *   - Payload: sub (ID), email, and role
 *   - Validation: Explicit password matching (Bcrypt-ready)
 *
 * Note: Placeholder password comparison used for local development.
 * Production readiness requires migration to Bcrypt.
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../modules/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials against the LibSQL persistence layer.
   * Logic: Finds user by email -> verifies password -> returns user without secret.
   */
  async validateUser(
    loginDto: LoginDto,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (user && user.password === loginDto.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Issues a signed JWT for an authenticated session.
   * Pattern: Stateless Bearer Token.
   */
  login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
