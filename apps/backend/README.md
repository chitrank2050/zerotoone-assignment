# AI Audience Builder - Backend 🧠🏛️

[![Domain: Systems Grade](https://img.shields.io/badge/Domain-Systems_Grade-E0234E?style=for-the-badge)](https://nestjs.com/)
[![Runtime: Node 20+](https://img.shields.io/badge/Runtime-Node_20+-339933?style=for-the-badge)](./package.json)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge)](https://www.postgresql.org/)
[![Security: RBAC Protected](https://img.shields.io/badge/Security-RBAC_Protected-black?style=for-the-badge)](./src/modules/auth/guards/roles.guard.ts)

The **Audience Builder Backend** is the high-performance intelligence layer of the platform. It orchestrates complex AI targeting workflows, ensures data integrity across the taxonomy, and enforces strict security protocols via stateless JWT authentication.

---

## 📖 Documentation

For full architectural details and API references, please refer to the root documentation:

- [**System Architecture**](../../docs/architecture.md)
- [**API Documentation**](../../docs/api/overview.md)
- [**Getting Started**](../../docs/getting-started.md)

---

## 🏛️ Architecture & Governance

This service is a **Modular Monolith** built on **NestJS 11**, prioritizing clear domain boundaries and type-safe execution.

### 🧠 Domain Pillars

- **Identity Layer (`AuthModule`)**: Implements stateless JWT authentication with Bcrypt hashing and Role-Based Access Control (RBAC).
- **Intelligence Layer (`ChatModule`)**: Orchestrates the **Google Gemini 1.5 Flash** engine for natural language audience mapping.
- **Taxonomy Layer (`TaxonomyModule`)**: Manages high-density targeting signals (Location, Transaction) via PostgreSQL.
- **Persistence Layer (`PrismaModule`)**: A centralized, type-safe data access layer using Prisma 7.
- **Cache Layer (`CacheCustomModule`)**: Hybrid caching strategy using **Redis (Upstash)** and local memory.

---

## 🛡️ Operational Safeguards

> [!IMPORTANT]
> **Database Sovereignty**: This service uses **PostgreSQL (Neon)**. Ensure your `DATABASE_URL` is correctly set in the `.env` file before running migrations.
> [!TIP]
> **Zero-Drift Policy**: All API DTOs in this service **must** implement interfaces from `@audience-builder/shared` to ensure perfect synchronization with the frontend.

---

## 🚀 Engineering Workflow

### 🗄️ Database Synchronization

```bash
# Apply migrations and generate client
pnpm db:migrate
pnpm db:generate

# Hydrate database with taxonomy data
pnpm db:seed
```

### ⚡ Execution

```bash
# Start development engine with HMR
pnpm dev

# Run unit tests
pnpm test

# Run E2E integration suite
pnpm test:e2e
```

---

<p align="center">
  ❤️ Developed by <b><a href="https://www.chitrankagnihotri.com">Chitrank Agnihotri</a></b>
</p>
