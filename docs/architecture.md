# 🏛️ System Architecture

This document provides a high-level overview of the **AI Audience Builder** architecture, its core components, and the design principles that govern its development.

## 🌟 Core Philosophy

The AI Audience Builder is built on the principle of **"Zero-Drift Engineering"**. Every architectural decision is made to ensure that the system remains type-safe, traceable, and highly maintainable as it scales.

- **Modular Monolith**: The backend is structured as a collection of domain-specific modules, ensuring clear boundaries while maintaining the simplicity of a single deployment unit.
- **Contract-First**: All data exchange between the frontend and backend is governed by a shared package of TypeScript interfaces.
- **State-as-URL**: The frontend leverages the URL as the primary source of truth for the application state, enabling deep-linking and consistent user experiences.

---

## 🏗️ Project Structure

The project is organized as a **Turborepo** monorepo:

```text
.
├── apps
│   ├── backend          # NestJS Modular Monolith
│   └── frontend         # React 19 + Vite + Tailwind CSS v4
├── packages
│   └── shared           # Shared DTOs, interfaces, and error keys
├── bruno                # API Collection for testing (Bruno)
├── docs                 # System & API Documentation
└── docker-compose.yml   # Container orchestration
```

---

## 🚀 Technology Stack

### Backend (`apps/backend`)

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
- **Caching**: In-Memory (Standard)
- **Observability**: Custom Correlation ID middleware & Performance Logging.

### Frontend (`apps/frontend`)

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

---

## 🧠 Domain Modules

### 1. Identity & Auth (`auth`)

Handles JWT-based authentication with Case-Insensitive Role-Based Access Control (RBAC) supporting `ADMIN` and `PLANNER` tiers.

### 2. Chat & AI Strategy (`chat`)

The core orchestration engine. It leverages Groq's high-performance inference to translate natural language prompts into a dual-part response:

1. **Conversational Reasoning**: Natural language explanation of the targeting strategy.
2. **Structured Signals**: A hidden JSON block containing validated taxonomy signals, reach estimates, and total audience counts.

This module utilizes Server-Sent Events (SSE) for real-time streaming to the frontend.

### 3. Taxonomy Engine (`taxonomy`)

Manages the hierarchical targeting signals (Location, Transaction, Field Dictionaries). It provides the "Taxonomy Tree" that the AI uses to select specific segments.

### 4. Shared Contracts (`@audience-builder/shared`)

Ensures that a change in the backend DTO is immediately reflected as a TypeScript error in the frontend, preventing runtime crashes.

---

## 🛡️ Governance & Safety

### AI Guardrails

The platform implements a **"Planner-in-the-loop"** model. AI-generated audience segments are recommendations that must be validated by a human `Planner` before being pushed to production targeting systems.

### Observability

Every request is tagged with an `x-correlation-id`. This ID is propagated through logs, allowing developers to trace the lifecycle of a specific request from the frontend to the database.
