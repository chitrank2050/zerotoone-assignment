import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDto {
  @ApiProperty({ example: 'conv-123' })
  id!: string;

  @ApiProperty({ example: 'Mumbai Luxury Real Estate' })
  title!: string;

  @ApiProperty({ example: '2026-05-11T12:00:00.000Z' })
  updatedAt!: Date;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'msg-123' })
  id!: string;

  @ApiProperty({ example: 'user' })
  role!: string;

  @ApiProperty({ example: 'Find Mumbai car buyers' })
  content!: string;

  @ApiProperty({ example: '2026-05-11T12:00:00.000Z' })
  createdAt!: Date;
}
