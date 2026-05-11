import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Something went wrong' })
  error!: string;

  @ApiProperty({ example: '2026-05-11T12:00:00.000Z' })
  timestamp!: string;
}
