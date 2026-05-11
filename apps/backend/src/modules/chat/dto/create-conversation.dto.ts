import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    description: 'The title of the audience build session',
    example: 'Luxury Car Buyers in Mumbai',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;
}
