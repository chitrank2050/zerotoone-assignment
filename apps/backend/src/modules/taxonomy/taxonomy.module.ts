import { Module } from '@nestjs/common';

import { TaxonomyController } from './taxonomy.controller';
import { TaxonomyService } from './taxonomy.service';

@Module({
  imports: [],
  providers: [TaxonomyService],
  controllers: [TaxonomyController],
  exports: [TaxonomyService],
})
export class TaxonomyModule {}
