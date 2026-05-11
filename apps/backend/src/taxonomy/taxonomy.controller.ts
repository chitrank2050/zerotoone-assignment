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
import { TaxonomyService } from './taxonomy.service';
import { ApiResponse } from '../common/responses/api-response';

@Controller('taxonomy')
export class TaxonomyController {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Fetches the location signal hierarchy.
   * Supports optional fuzzy search via the 'q' query parameter.
   */
  @Get('locations')
  async getLocations(@Query('q') query?: string) {
    const result = query
      ? await this.taxonomyService.searchLocations(query)
      : await this.taxonomyService.getAllLocations();
    return ApiResponse.ok(result);
  }

  /**
   * Fetches the transaction/spending signal hierarchy.
   * Matches against categorical names and hierarchical paths.
   */
  @Get('transactions')
  async getTransactions(@Query('q') query?: string) {
    const result = query
      ? await this.taxonomyService.searchTransactions(query)
      : await this.taxonomyService.getAllTransactions();
    return ApiResponse.ok(result);
  }
}
