import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

interface TaxonomyItem {
  id: string;
  name: string;
  path: string;
}

async function main() {
  console.log('Seeding data...');

  // 1. Seed Users
  await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        id: 'admin-user-id',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
    }),
    prisma.user.upsert({
      where: { email: 'planner@example.com' },
      update: {},
      create: {
        email: 'planner@example.com',
        password: 'password123',
        role: 'planner',
      },
    }),
  ]);

  // 2. Load Location Taxonomy
  const locationData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../data/location_taxonomy.json'),
      'utf8',
    ),
  ) as TaxonomyItem[];

  await Promise.all(
    locationData.map((item) =>
      prisma.locationTaxonomy.upsert({
        where: { externalId: item.id },
        update: {},
        create: {
          externalId: item.id,
          name: item.name,
          path: item.path,
        },
      }),
    ),
  );

  // 3. Load Transaction Taxonomy
  const transactionData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../data/transaction_taxonomy.json'),
      'utf8',
    ),
  ) as TaxonomyItem[];

  await Promise.all(
    transactionData.map((item) =>
      prisma.transactionTaxonomy.upsert({
        where: { externalId: item.id },
        update: {},
        create: {
          externalId: item.id,
          name: item.name,
          path: item.path,
        },
      }),
    ),
  );

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
