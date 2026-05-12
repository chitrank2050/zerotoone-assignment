# 🛠️ Development Workflow

This document outlines the engineering standards and workflows for contributing to the AI Audience Builder.

## 🤝 The Shared Contract Workflow

Because this is a monorepo with high type-safety requirements, you must follow the **Shared Contract Workflow** when modifying data structures.

1. **Modify the Contract**: Update the interfaces in `packages/shared/src/index.ts`.
2. **Synchronize**: Run `pnpm build` from the root. This ensures that the types are compiled and available to both `apps/backend` and `apps/frontend`.
3. **Implement**: Update the backend service and then the frontend component.

> [!WARNING]
> **Do not define DTOs locally**. If a data structure is used in an API request or response, it MUST reside in `@audience-builder/shared`.

---

## 🏗️ Backend Engineering Standards

### Modular Monolith Structure

Each feature should be encapsulated in a module under `apps/backend/src/modules/`.

- `*.module.ts`: NestJS module definition.
- `*.controller.ts`: API route handlers.
- `*.service.ts`: Business logic (Keep controllers thin).
- `*.dto.ts`: Local DTOs (only if they don't cross the network boundary).

### Error Handling

Use the shared `ErrorKeys` from the shared package to ensure the frontend can provide localized or user-friendly error messages.

---

## 🎨 Frontend Engineering Standards

### Design System

We use **Tailwind CSS v4**. Avoid using ad-hoc CSS classes; stick to the design system tokens defined in `index.css`.

### State Management

- **Local State**: `useState` / `useReducer` for component-level UI state.
- **Global State**: React Context for user sessions and global settings.
- **Persistent State**: Use URL search parameters for filters, search queries, and selected items.

---

## 🧹 Hygiene & Quality Gates

This project enforces strict quality gates via **Lefthook** and **git-hygiene**.

- **Linting**: All code must pass `pnpm lint`.
- **Formatting**: Code must be formatted with Prettier via `pnpm format`.
- **Types**: No `any` types allowed. Run `pnpm check-types` to verify workspace-wide type safety.

### Commit Messages

We follow Conventional Commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `chore:` Maintenance tasks

---

## 🧪 Testing Strategy

- **Unit Tests**: Place `.spec.ts` files alongside the source code. Focus on testing business logic in services.
- **Integration Tests**: Focus on API endpoints and database interactions.
- **E2E Tests**: Use the `test:e2e` command in the backend to verify the full request-response lifecycle.

---

## 🚀 CI/CD & Deployment

We use **GitHub Actions** to automate our documentation deployment.

### 📖 Docs Pipeline (`docs.yml`)

Automatically builds the **MkDocs** site and deploys it to GitHub Pages whenever changes are merged into the `main` branch.
