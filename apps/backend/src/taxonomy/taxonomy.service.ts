import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaxonomyService {
  constructor(private prisma: PrismaService) {}

  async searchLocations(query: string) {
    return this.prisma.locationTaxonomy.findMany({
      where: {
        OR: [{ name: { contains: query } }, { path: { contains: query } }],
      },
    });
  }

  async searchTransactions(query: string) {
    return this.prisma.transactionTaxonomy.findMany({
      where: {
        OR: [{ name: { contains: query } }, { path: { contains: query } }],
      },
    });
  }

  async getAllLocations() {
    return this.prisma.locationTaxonomy.findMany();
  }

  async getAllTransactions() {
    return this.prisma.transactionTaxonomy.findMany();
  }
}
