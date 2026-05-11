import { ApiProperty } from '@nestjs/swagger';

export class TaxonomyResponseDto {
  @ApiProperty({ example: 'loc_123' })
  externalId!: string;

  @ApiProperty({ example: 'India > Maharashtra > Mumbai' })
  name!: string;

  @ApiProperty({ example: '/india/maharashtra/mumbai' })
  path!: string;
}
