<div align="center">
  <h1>AI Audience Builder</h1>
  <p><strong>A high-performance monorepo for building AI-driven advertising segments.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Monorepo-Turborepo-6366f1?style=for-the-badge" alt="Turbo">
    <img src="https://img.shields.io/badge/Backend-NestJS_11-E0234E?style=for-the-badge" alt="NestJS">
    <img src="https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge" alt="React">
    <img src="https://img.shields.io/badge/AI-Gemini_1.5-4285F4?style=for-the-badge" alt="Gemini">
    <img src="https://img.shields.io/badge/Database-LibSQL-003B57?style=for-the-badge" alt="LibSQL">
    <img src="https://img.shields.io/badge/Hooks-Lefthook-blueviolet?style=for-the-badge" alt="Lefthook">
  </p>
</div>

---

## 🏛️ Architecture

This project is a modern **Turborepo monorepo** designed for maximum type safety and development velocity. It leverages a shared types package and automated build pipelines.

```text
┌─────────────────────────────────────────────────────┐
│                  AI Audience Builder                │
│                                                     │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐  │
│  │ frontend │ <──> │  shared  │ <──> │  backend │  │
│  │ (React)  │      │ (Types)  │      │ (NestJS) │  │
│  └────┬─────┘      └──────────┘      └────┬─────┘  │
│       │                                   │         │
│  ┌────▼─────────────┐               ┌─────▼─────┐   │
│  │   Vite / HMR     │               │  Prisma   │   │
│  └──────────────────┘               └─────┬─────┘   │
│                                           │         │
│                                     ┌─────▼─────┐   │
│                                     │  LibSQL   │   │
│                                     └───────────┘   │
└─────────────────────────────────────────────────────┘
```

### 🛠️ Tech Stack

| Domain        | Technology                                                                                     | Purpose                                  |
| :------------ | :--------------------------------------------------------------------------------------------- | :--------------------------------------- |
| **Backend**   | [NestJS 11](https://nestjs.com/)                                                               | Modular backend architecture             |
| **Frontend**  | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)                                   | High-performance UI + HMR                |
| **Language**  | [TypeScript 6.0](https://www.typescriptlang.org/)                                              | Strict type-safe development             |
| **AI Engine** | [Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/)                               | Natural language audience mapping        |
| **Database**  | [LibSQL](https://turso.tech/libsql) + [Prisma 7](https://www.prisma.io/)                       | Localized persistence with Turso adapter |
| **Monorepo**  | [Turborepo](https://turbo.build/)                                                              | High-speed task orchestration & caching  |
| **Quality**   | [ESLint 9](https://eslint.org/) + [Prettier](https://prettier.io/)                             | Modern flat-config linting & formatting  |
| **Hygiene**   | [Lefthook](https://lefthook.dev/) + [git-hygiene](https://github.com/chitrank2050/git-hygiene) | Automated commit & branch standards      |

---

## 🚀 Getting Started

**Prerequisites**: Node.js >= 24, pnpm >= 10, Docker

### ⚡ Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup Environment
# Copy .env.example (if available) or create a .env in apps/backend with:
# DATABASE_URL="file:./dev.db"
# GEMINI_API_KEY="your-key"
# JWT_SECRET="your-secret"

# 3. Synchronize Database
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 4. Start Development Mode
pnpm dev
```

### 📦 Docker Orchestration

To run the entire stack in a production-like containerized environment:

```bash
pnpm docker:build
```

---

## 📂 Project Structure

```text
audience-builder/
├── apps/
│   ├── backend/         # NestJS application (Core Business Logic)
│   └── frontend/        # React + Vite application (UI/UX)
├── packages/
│   └── shared/          # Shared TypeScript interfaces & constants
├── data/                # Taxonomy & Data Dictionary (Reference only)
├── lefthook.yml         # High-performance Git hooks
├── turbo.json           # Turborepo task configuration
└── package.json         # Workspace manifest & scripts
```

---

## 🛠️ Operational Scripts

| Command             | Scope   | Description                            |
| :------------------ | :------ | :------------------------------------- |
| `pnpm dev`          | Root    | Starts all apps in parallel watch mode |
| `pnpm build`        | Root    | Performs a full build of all packages  |
| `pnpm lint`         | Root    | Runs strict ESLint + Markdownlint      |
| `pnpm format`       | Root    | Formats all code & documentation       |
| `pnpm db:generate`  | Backend | Regenerates Prisma client              |
| `pnpm db:seed`      | Backend | Hydrates LibSQL with taxonomies        |
| `pnpm docker:build` | Root    | Orchestrates full containerized build  |

---

Developed by [Chitrank Agnihotri](https://www.chitrankagnihotri.com)
As part of a Engineering Assessment.
