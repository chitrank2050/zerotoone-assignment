import { Controller, Get, Query } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { ApiResponse } from '../common/responses/api-response';

@Controller('taxonomy')
export class TaxonomyController {
  constructor(private taxonomyService: TaxonomyService) {}

  @Get('locations')
  async getLocations(@Query('q') query?: string) {
    const result = query 
      ? await this.taxonomyService.searchLocations(query)
      : await this.taxonomyService.getAllLocations();
    return ApiResponse.ok(result);
  }

  @Get('transactions')
  async getTransactions(@Query('q') query?: string) {
    const result = query 
      ? await this.taxonomyService.searchTransactions(query)
      : await this.taxonomyService.getAllTransactions();
    return ApiResponse.ok(result);
  }
}
