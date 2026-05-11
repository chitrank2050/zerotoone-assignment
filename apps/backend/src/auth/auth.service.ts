import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

/**
 * AuthService handles the identity and access management for the platform.
 * It provides methods for user validation (authentication) and JWT issuance.
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials.
   * Compares the provided email and password against the database records.
   *
   * @param loginDto Object containing email and raw password.
   * @returns The user object (excluding password) if valid, otherwise null.
   */
  async validateUser(
    loginDto: LoginDto,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // In a production environment, this would use bcrypt.compare
    if (user && user.password === loginDto.password) {
      // Strip password before returning the user object to the controller
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Generates a signed JWT for an authenticated user.
   *
   * @param user The user object returned from validateUser.
   * @returns An object containing the access_token and a public user profile.
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
