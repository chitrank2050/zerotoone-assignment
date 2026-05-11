import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({
    example: { id: 'user-123', email: 'admin@example.com', role: 'admin' },
  })
  user!: {
    id: string;
    email: string;
    role: string;
  };
}
