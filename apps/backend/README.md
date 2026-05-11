# AI Audience Builder - Backend 🧠🏛️

[![Domain: Systems Grade](https://img.shields.io/badge/Domain-Systems_Grade-E0234E?style=for-the-badge)](https://nestjs.com/)
[![Runtime: Node 24](https://img.shields.io/badge/Runtime-Node_24-339933?style=for-the-badge)](./package.json)
[![Database: LibSQL](https://img.shields.io/badge/Database-LibSQL-003B57?style=for-the-badge)](https://turso.tech/libsql)
[![Security: RBAC Protected](https://img.shields.io/badge/Security-RBAC_Protected-black?style=for-the-badge)](./src/modules/auth/guards/roles.guard.ts)

The **Audience Builder Backend** is the high-performance intelligence layer of the platform. It orchestrates complex AI targeting workflows, ensures data integrity across the taxonomy, and enforces strict security protocols via stateless JWT authentication.

---

## 🏛️ Architecture & Governance

This service is a **Modular Monolith** built on **NestJS 11**, prioritizing clear domain boundaries and type-safe execution.

### 🧠 Domain Pillars

- **Identity Layer (`AuthModule`)**: Implements stateless JWT authentication with Bcrypt hashing and production-ready Role-Based Access Control (RBAC).
- **Intelligence Layer (`ChatModule`)**: Orchestrates the **Google Gemini 1.5 Flash** engine for natural language audience mapping and signal extraction.
- **Taxonomy Layer (`TaxonomyModule`)**: Manages high-density targeting signals with hierarchical LibSQL queries.
- **Persistence Layer (`PrismaModule`)**: A centralized, type-safe data access layer using Prisma 7 and the LibSQL adapter.

---

## 🛡️ Operational Safeguards

> [!IMPORTANT]
> **Database Sovereignty**: This service uses **LibSQL (SQLite)**. In production-mirror environments (Docker), the database is persisted via a volume mount to `/app/apps/backend/prisma`. Always ensure migrations are applied via `pnpm db:deploy` before service start.
> [!TIP]
> **AI Intent**: All interactions with the Gemini API are governed by a strict system prompt to ensure deterministic extraction of targeting signals from conversational input.

---

## 🚀 Engineering Workflow

### 🗄️ Database Synchronization

Every schema modification requires a synchronized regeneration of the Prisma client to maintain type-safe sovereignty.

```bash
# Full synchronization cycle
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### ⚡ Execution

```bash
# Start development engine with HMR
pnpm start:dev

# Run Vitest unit suite
pnpm test

# Run E2E integration suite
pnpm test:e2e
```

---

<p align="center">
  ❤️ Developed by <b><a href="https://www.chitrankagnihotri.com">Chitrank Agnihotri</a></b>
</p>
