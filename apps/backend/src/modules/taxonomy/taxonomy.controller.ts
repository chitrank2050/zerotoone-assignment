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

import { ApiResponse } from '@common/responses/api-response';

import { SearchTaxonomyDto } from './dto/search-taxonomy.dto';
import { TaxonomyService } from './taxonomy.service';

@Controller('taxonomy')
export class TaxonomyController {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Fetches the location signal hierarchy.
   * Supports optional fuzzy search via the 'q' query parameter.
   */
  @Get('locations')
  async getLocations(@Query() dto: SearchTaxonomyDto) {
    const result = dto.q
      ? await this.taxonomyService.searchLocations(dto.q)
      : await this.taxonomyService.getAllLocations();
    return ApiResponse.ok(result);
  }

  /**
   * Fetches the transaction/spending signal hierarchy.
   * Matches against categorical names and hierarchical paths.
   */
  @Get('transactions')
  async getTransactions(@Query() dto: SearchTaxonomyDto) {
    const result = dto.q
      ? await this.taxonomyService.searchTransactions(dto.q)
      : await this.taxonomyService.getAllTransactions();
    return ApiResponse.ok(result);
  }
}
