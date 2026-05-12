# AI Audience Builder - Frontend 🎨✨

[![Domain: UX Grade](https://img.shields.io/badge/Domain-UX_Grade-61DAFB?style=for-the-badge)](https://react.dev/)
[![Framework: React 19](https://img.shields.io/badge/Framework-React_19-61DAFB?style=for-the-badge)](./package.json)
[![Styling: Premium Custom](https://img.shields.io/badge/Styling-Premium_Custom-FF69B4?style=for-the-badge)](./src/index.css)
[![Contracts: Shared Sync](https://img.shields.io/badge/Contracts-Shared_Sync-FFD700?style=for-the-badge)](../../packages/shared)

The **Audience Builder Frontend** is a high-rigor, reactive dashboard designed for precision advertising. It provides a seamless interface for translating natural language intent into deterministic audience segments using real-time AI signals.

---

## 📖 Documentation

For full architectural details and setup guides, please refer to the root documentation:

- [**System Architecture**](../../docs/architecture.md)
- [**Getting Started**](../../docs/getting-started.md)
- [**Development Workflow**](../../docs/development.md)

---

## 🏛️ Architecture & UX Design

Built with **React 19** and **Vite**, this application prioritizes "State-as-URL Truth" and high-density visual feedback.

### ✨ Experience Pillars

- **AI Co-pilot**: A reactive chat interface that converts human intent into machine-readable targeting signals via **Gemini 1.5**.
- **Reachability Engine**: Real-time visualization of audience size estimates as signals are added/removed.
- **Glassmorphic Aesthetic**: A premium, high-contrast design system with smooth micro-animations and zero-layout-shift (CLS) transitions.
- **Type-Safe Boundary**: Consumes strictly typed DTOs and ErrorKeys from `@audience-builder/shared` for zero-drift synchronization with the backend.

---

## 🛡️ Operational Safeguards

> [!IMPORTANT]
> **Contract Hygiene**: This frontend is strictly coupled to the `@audience-builder/shared` package. Always ensure that `pnpm build` is run from the root after shared package changes to update the local type definitions.
> [!TIP]
> **Hydration Hygiene**: All components are designed with a "Single Source of Truth" for state, ensuring predictable UI behavior during high-frequency AI signal updates.

---

## 🚀 Engineering Workflow

### ⚡ Execution

```bash
# Start development engine with HMR
pnpm dev

# Perform production-ready build
pnpm build

# Run Vitest unit suite
pnpm test
```

---

<p align="center">
  ❤️ Developed by <b><a href="https://www.chitrankagnihotri.com">Chitrank Agnihotri</a></b>
</p>
