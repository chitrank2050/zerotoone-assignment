# AI Audience Builder - Backend

The core intelligence layer for the Audience Builder platform.

## 🏛️ Architecture

Built with **NestJS 11**, this service follows a modular architecture designed for scalability and clear domain separation.

### 🧠 Core Modules

- **AuthModule**: Handles user authentication and JWT issuance.
- **ChatModule**: Orchestrates the interaction with **Google Gemini 1.5 Flash**.
- **TaxonomyModule**: Manages the retrieval and searching of targeting signals.
- **PrismaModule**: Provides the data access layer for the LibSQL database.

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **ORM**: Prisma 7
- **Database**: LibSQL (SQLite-compatible)
- **AI**: Google Generative AI (Gemini)
- **Validation**: class-validator + class-transformer

## 🚀 Development

### Database Sync

Whenever the schema changes:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### Start Server

```bash
pnpm start:dev
```
