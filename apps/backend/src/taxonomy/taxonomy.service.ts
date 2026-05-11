import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * TaxonomyService manages the retrieval and searching of hierarchical targeting signals.
 * It provides the source of truth for location-based and transaction-based signals
 * used by the AI engine and the frontend selection UI.
 */
@Injectable()
export class TaxonomyService {
  constructor(private prisma: PrismaService) {}

  /**
   * Searches the location taxonomy based on a natural language query.
   * Matches against both the node name and the full hierarchical path.
   *
   * @param query Search term (e.g., "California" or "USA > West")
   */
  async searchLocations(query: string) {
    return this.prisma.locationTaxonomy.findMany({
      where: {
        OR: [{ name: { contains: query } }, { path: { contains: query } }],
      },
    });
  }

  /**
   * Searches the transaction taxonomy (spending categories).
   *
   * @param query Search term (e.g., "Grocery" or "Luxury Retail")
   */
  async searchTransactions(query: string) {
    return this.prisma.transactionTaxonomy.findMany({
      where: {
        OR: [{ name: { contains: query } }, { path: { contains: query } }],
      },
    });
  }

  /**
   * Fetches the entire location taxonomy tree.
   * Typically used for providing context to AI models.
   */
  async getAllLocations() {
    return this.prisma.locationTaxonomy.findMany();
  }

  /**
   * Fetches the entire transaction taxonomy tree.
   * Typically used for providing context to AI models.
   */
  async getAllTransactions() {
    return this.prisma.transactionTaxonomy.findMany();
  }
}
