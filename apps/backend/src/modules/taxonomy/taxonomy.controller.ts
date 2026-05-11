/**
 * TaxonomyController - Master Signal Catalog API
 *
 * Provides access to the hierarchical location and transaction taxonomies.
 * Used for both the AI context injection and manual signal browsing.
 *
 * Endpoints:
 *   GET /taxonomy/locations     - Search or list geographical targeting signals
 *   GET /taxonomy/transactions  - Search or list spending/categorical signals
 *
 * Performance: Leverages LibSQL 'contains' for performant path-based searching.
 */
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponse as AppResponse } from '@common/responses/api-response';

import { SearchTaxonomyDto } from './dto/search-taxonomy.dto';
import { TaxonomyResponseDto } from './dto/taxonomy-response.dto';
import { TaxonomyService } from './taxonomy.service';

@ApiTags('Taxonomy')
@Controller('taxonomy')
export class TaxonomyController {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Fetches the location signal hierarchy.
   */
  @Get('locations')
  @ApiOperation({ summary: 'Search or list geographical targeting signals' })
  @ApiResponse({
    status: 200,
    description: 'List of location signals retrieved',
    type: [TaxonomyResponseDto],
  })
  async getLocations(@Query() dto: SearchTaxonomyDto) {
    const result = dto.q
      ? await this.taxonomyService.searchLocations(dto.q)
      : await this.taxonomyService.getAllLocations();
    return AppResponse.ok(result);
  }

  /**
   * Fetches the transaction/spending signal hierarchy.
   */
  @Get('transactions')
  @ApiOperation({ summary: 'Search or list spending/categorical signals' })
  @ApiResponse({
    status: 200,
    description: 'List of transaction signals retrieved',
    type: [TaxonomyResponseDto],
  })
  async getTransactions(@Query() dto: SearchTaxonomyDto) {
    const result = dto.q
      ? await this.taxonomyService.searchTransactions(dto.q)
      : await this.taxonomyService.getAllTransactions();
    return AppResponse.ok(result);
  }
}
