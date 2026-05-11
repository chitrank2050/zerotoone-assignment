import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'The natural language description of the target audience',
    example:
      'High-income individuals interested in real estate investment in Pune.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  text!: string;
}
