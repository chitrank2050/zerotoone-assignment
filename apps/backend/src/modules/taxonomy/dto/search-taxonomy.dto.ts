import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class SearchTaxonomyDto {
  @ApiProperty({
    description: 'Fuzzy search query for taxonomy signals',
    example: 'Luxury',
    required: false,
    name: 'q',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  q?: string;
}
