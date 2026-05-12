import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { SendMessageRequest } from '@audience-builder/shared';

export class SendMessageDto implements SendMessageRequest {
  @ApiProperty({
    description: 'The natural language description of the target audience',
    example:
      'High-income individuals interested in real estate investment in Pune.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  content!: string;
}
