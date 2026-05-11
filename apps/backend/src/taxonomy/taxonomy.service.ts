/**
 * TaxonomyService - Master Signal Provider
 *
 * Manages the retrieval and filtering of the audience targeting signal catalog.
 * Acts as the source of truth for both the AI engine (context injection)
 * and the frontend (manual signal browsing/selection).
 *
 * Domains:
 *   - Locations: Geographical hierarchies (Country > State > City).
 *   - Transactions: Category-based spending signals (e.g., Luxury Retail, Grocery).
 *
 * Performance: Utilizes LibSQL 'contains' queries for performant path-based search.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class TaxonomyService {
  constructor(private prisma: PrismaService) {}

  /**
   * Performs a fuzzy search across the geographical signal catalog.
   */
  async searchLocations(query: string) {
    return this.prisma.locationTaxonomy.findMany({
      where: {
        OR: [{ name: { contains: query } }, { path: { contains: query } }],
      },
    });
  }

  /**
   * Performs a fuzzy search across the spending/transaction signal catalog.
   */
  async searchTransactions(query: string) {
    return this.prisma.transactionTaxonomy.findMany({
      where: {
        OR: [{ name: { contains: query } }, { path: { contains: query } }],
      },
    });
  }

  /**
   * Retrieves the full location hierarchy for AI context injection.
   */
  async getAllLocations() {
    return this.prisma.locationTaxonomy.findMany();
  }

  /**
   * Retrieves the full transaction hierarchy for AI context injection.
   */
  async getAllTransactions() {
    return this.prisma.transactionTaxonomy.findMany();
  }
}
