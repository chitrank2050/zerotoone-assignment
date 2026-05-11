import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { ApiResponse } from '@common/responses/api-response';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const result = this.authService.login(user);
    return ApiResponse.ok(result);
  }
}
