# @audience-builder/shared 🤝💎

[![Domain: Contract Grade](https://img.shields.io/badge/Domain-Contract_Grade-FFD700?style=for-the-badge)](./src/index.ts)
[![Type: TypeScript 6](https://img.shields.io/badge/Type-TypeScript_6-3178C6?style=for-the-badge)](./package.json)
[![Sync: Zero Drift](https://img.shields.io/badge/Sync-Zero_Drift-success?style=for-the-badge)](../../apps/backend)

The **Single Source of Truth** for the Audience Builder ecosystem. This package enforces architectural rigor by centralizing all cross-boundary contracts, ensuring that the Frontend and Backend remain in perfect lockstep.

---

## 🏛️ Governance & Integrity

This package is the "Ground Truth" of the monorepo. It defines the communication protocol between services.

### 📦 Contract Pillars

- **Machine-Readable Errors (`ErrorKeys`)**: Standardized string keys for consistent error handling and internationalization.
- **Payload Sovereignty (DTOs)**: Strictly typed request and response interfaces (`LoginRequest`, `ApiResponse`) that prevent runtime payload drift.
- **Domain Entities**: Shared model definitions (`User`, `Signal`, `Taxonomy`) that synchronize the Prisma schema with the UI state.

---

## 🛡️ Operational Safeguards

> [!IMPORTANT]
> **Zero Drift Mandate**: Any change to this package MUST be followed by a workspace-wide build (`pnpm build` from root). Failure to do so will result in "Ghost Type" errors where the IDE shows correct types but the runtime build is stale.
> [!TIP]
> **Semantic Versioning**: As an internal workspace package (`workspace:*`), changes are reflected immediately across the monorepo, enabling atomic refactoring.

---

## 🚀 Engineering Workflow

### ⚡ Compilation

```bash
# Clean and rebuild shared contracts
pnpm build

# Run unit tests for utility logic
pnpm test
```

---

<p align="center">
  ❤️ Developed by <b><a href="https://www.chitrankagnihotri.com">Chitrank Agnihotri</a></b>
</p>
