import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
// We use string literals for Roles to avoid Prisma 7 ghost-import issues in monorepos.

// --- Types & Interfaces ---

interface DictRecord {
  'Field Name': string;
  'Field Description': string;
  'Field Type': string;
  Attributes: string;
  'Field Values': string;
  'Field Range Min': string;
  'Field Range Max': string;
}

interface ValueRecord {
  'Field Name': string;
  'Field Value': string;
  'Field Value Description': string;
}

interface LocationRecord {
  top_category: string;
  sub_category: string;
}

interface TransRecord {
  'Level 1': string;
  'Level 2': string;
  'Level 3': string;
  'Level 4': string;
}

// --- Initialization ---

const pool = new Pool({
  connectionString: process.env.DATABASE_URL as string,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Utility to load and parse CSV files
 */
function loadCsv<T>(filename: string): T[] {
  const content = fs.readFileSync(
    path.join(__dirname, `../data/${filename}`),
    'utf8',
  );
  return parse(content, { columns: true, skip_empty_lines: true }) as T[];
}

// --- Seeding Modules ---

// --- Seeding Modules ---

async function seedUsers() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log('👤 Users already exist, skipping...');
    return;
  }
  console.log('👤 Seeding Users...');
  return Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        id: 'admin-user-id',
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN' as any,
      },
    }),
    prisma.user.upsert({
      where: { email: 'planner@example.com' },
      update: {},
      create: {
        email: 'planner@example.com',
        password: 'password123',
        role: 'PLANNER' as any,
      },
    }),
  ]);
}

async function seedMetadata() {
  const dictCount = await prisma.dataDictionary.count();
  if (dictCount > 0) {
    console.log('📖 Metadata already exists, skipping...');
    return;
  }
  console.log('📖 Seeding Metadata Layer (Batch)...');

  const dictRecords = loadCsv<DictRecord>('cg_data_dictionary.csv');
  const valueRecords = loadCsv<ValueRecord>('cg_field_values.csv');

  await prisma.dataDictionary.createMany({
    data: dictRecords.map((r) => ({
      fieldName: r['Field Name'],
      fieldDescription: r['Field Description'],
      fieldType: r['Field Type'],
      attributes: r['Attributes'],
      fieldValues: r['Field Values'],
      minRange: r['Field Range Min'] ? parseFloat(r['Field Range Min']) : null,
      maxRange: r['Field Range Max'] ? parseFloat(r['Field Range Max']) : null,
    })),
    skipDuplicates: true,
  });

  await prisma.fieldValue.createMany({
    data: valueRecords.map((r) => ({
      fieldName: r['Field Name'],
      value: r['Field Value'],
      description: r['Field Value Description'],
    })),
    skipDuplicates: true,
  });
}

async function seedLocationTaxonomy() {
  const count = await prisma.locationTaxonomy.count();
  if (count > 0) {
    console.log('📍 Location Taxonomy already exists, skipping...');
    return;
  }
  console.log('📍 Seeding Location Taxonomy...');
  const records = loadCsv<LocationRecord>('location_taxonomy.csv');
  const cache = new Map<string, string>();

  for (const r of records) {
    const top = r.top_category?.trim();
    const sub = r.sub_category?.trim();
    if (!top) continue;

    let topId = cache.get(top);
    if (!topId) {
      const node = await prisma.locationTaxonomy.upsert({
        where: { externalId: `loc_${top}` },
        update: {},
        create: {
          externalId: `loc_${top}`,
          name: top.replace(/_/g, ' '),
          path: top,
        },
      });
      topId = node.id;
      cache.set(top, topId);
    }

    if (sub && sub !== top) {
      await prisma.locationTaxonomy.upsert({
        where: { externalId: `loc_${top}_${sub}` },
        update: {},
        create: {
          externalId: `loc_${top}_${sub}`,
          name: sub.replace(/_/g, ' '),
          path: `${top} > ${sub}`,
          parentId: topId,
        },
      });
    }
  }
}

async function seedTransactionTaxonomy() {
  const count = await prisma.transactionTaxonomy.count();
  if (count > 0) {
    console.log('💸 Transaction Taxonomy already exists, skipping...');
    return;
  }
  console.log('💸 Seeding Transaction Taxonomy...');
  const records = loadCsv<TransRecord>('transaction_taxonomy.csv');
  const cache = new Map<string, string>();

  for (const r of records) {
    const levels = [r['Level 1'], r['Level 2'], r['Level 3'], r['Level 4']]
      .map((l) => l?.trim())
      .filter(Boolean);

    let parentId: string | undefined;
    let currentPath = '';

    for (const name of levels) {
      currentPath = currentPath ? `${currentPath} > ${name}` : name;
      const extId = `trans_${currentPath.replace(/\s+/g, '_').toLowerCase()}`;

      let nodeId = cache.get(extId);
      if (!nodeId) {
        const node = await prisma.transactionTaxonomy.upsert({
          where: { externalId: extId },
          update: {},
          create: {
            externalId: extId,
            name,
            path: currentPath,
            parentId,
          },
        });
        nodeId = node.id;
        cache.set(extId, nodeId);
      }
      parentId = nodeId;
    }
  }
}

// --- Main Orchestrator ---

async function main() {
  console.log('🚀 Starting Production Seed...');

  // 1. Parallel Ingestion for Flat Data
  await Promise.all([seedUsers(), seedMetadata()]);

  // 2. Sequential Ingestion for Hierarchical Data
  await seedLocationTaxonomy();
  await seedTransactionTaxonomy();

  console.log('✅ Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
