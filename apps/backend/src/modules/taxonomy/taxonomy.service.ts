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
 * Performance: Utilizes Prisma 'contains' queries for performant path-based search.
 */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CACHE_TTL } from '@common/constants/app';
import { PrismaService } from '@modules/prisma/prisma.service';

@Injectable()
export class TaxonomyService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Performs a fuzzy search across the geographical signal catalog.
   */
  async searchLocations(query: string) {
    return this.prisma.locationTaxonomy.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { path: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  /**
   * Performs a fuzzy search across the spending/transaction signal catalog.
   */
  async searchTransactions(query: string) {
    return this.prisma.transactionTaxonomy.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { path: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  /**
   * Retrieves the full location hierarchy for AI context injection.
   */
  async getAllLocations() {
    const cacheKey = 'taxonomy:locations';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as any;

    const locations = await this.prisma.locationTaxonomy.findMany();
    await this.cacheManager.set(cacheKey, locations, CACHE_TTL);
    return locations;
  }

  /**
   * Retrieves the full transaction hierarchy for AI context injection.
   */
  async getAllTransactions() {
    const cacheKey = 'taxonomy:transactions';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as any;

    const transactions = await this.prisma.transactionTaxonomy.findMany();
    await this.cacheManager.set(cacheKey, transactions, CACHE_TTL);
    return transactions;
  }
}
