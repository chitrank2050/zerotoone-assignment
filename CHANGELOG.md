# 📜 Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0]

### Build

- Migrate Dockerfile to Alpine Linux and optimize production image layering

### ♻️ Refactor

- Remove unused Request import from chat controller
- Improve documentation, add error handling to API calls & extend taxonomy service func
- Convert Prisma and shared interface imports to type-only imports
- Replace Joi with class-validator for type-safe env management & add example .env files
- Parallelize database seeding operations using Promise.all
- Reorganize project directory structure and remove throttler dependency
- Update module import paths to use consistent directory structure
- Implement path aliases in tsconfig and update module imports accordingly
- Standardize module imports using path aliases and update tsconfig path mappings
- Update PrismaService import path to use module alias
- Update tsconfig path mappings and formatting configuration
- Remove generic ApiResponse wrapper and implement centralized Prisma error handling & const
- Migrate testing framework from Jest to Vitest
- Standardize error handling by migrating hardcoded messages to shared constant keys
- Modernize monorepo configuration, update project doc & refine maintenance scripts
- Update SignalCard design, add metadata support to shared types
- Use type-only import for ReactNode in Main component
- Unify UI components with consistent glassmorphism styles and neutral color palette
- Standardize UI components and typography with a minimalist, monochromatic design language
- Migrate database provider from SQLite to PostgreSQL with native JSON support
- Centralize AI prompts and cache configuration constants across the application
- Update chat UI components with refined styling, labels, and layout consistency
- Remove Redis dependency for in-memory caching and optimize Prisma seeding
- Migrate AI orchestration from Gemini to Groq LLaMA 3.3 and implement routing for auth

### ⚙️ Miscellaneous Tasks

- Remove unused prisma and tsx development dependencies
- Refactor monorepo with improved linting, formatting rules, shared package integration, and TypeScript type safety.
- Refactor codebase formatting, update project dependencies, and improve documentation consistency.
- Add lefthook configuration, update path resolution for taxonomy data & introduce git-hygiene
- Add project-wide editor configuration and markdown linting support
- Ignore eslint configs and enable projectService for type-aware linting across all packages
- Upgrade TypeScript to 6.0, update Prisma configuration, and refine tsconfig settings
- Add jest types and test directory to tsconfig and enable default project for eslint config
- Set container names in docker-compose and update prisma dependency management in backend
- Add root ESLint configuration and optimize backend Docker build process
- Implement backend security, rate limiting, health checks, and environment validation
- Migrate testing framework to vitest, upgrade typescript, and reorganize monorepo scripts
- Update README documentation and adjust DATABASE_URL path in environment configuration
- Simplify git-hygiene configuration by removing redundant types and ignore branches
- Add MIT license and project metadata to package.json
- Remove obsolete Prisma migration files and lock configuration

### 🎨 Styling

- Normalize whitespace in eslint configuration file
- Format codebase with consistent imports and ESLint configuration updates

### 🐛 Bug Fixes

- Handle non-Error objects in Gemini API error logging and update documentation
- Update backend startup command to point to correct main.js path
- Update handleSend event type to React.SubmitEvent in ChatInput

### 📚 Documentation

- Improve documentation and standardise code across services and packages
- Update architecture description and add engineering hygiene section to README
- Add environment configuration guide and update setup command reference in README
- Add API documentation and update backend DTOs to implement shared request interfaces
- Initialize changelog file
- Add deployment guide, update architecture for Groq/React Router v7
- Update site URL and add deployment guide to documentation navigation
- Add Render free-tier cold start warnings and update deployment production endpoints
- Add ALLOWED_ORIGINS to configuration documentation and update Groq API key example
- Fix formatting and alignment of environment variable documentation table in README

### 🚀 Features

- Initialize project monorepo with backend, frontend, and shared packages
- Migrate styling from custom CSS to TailwindCSS v4
- Add tsx, export TaxonomyService, fix prisma seed, and update Dockerfile build process
- Add health monitoring module and integrate Swagger API documentation
- Add Swagger ApiProperty decorators and refine validation constraints for LoginDto fields
- Implement DTO-based request validation for chat and taxonomy modules and configure SWC builder
- Add Swagger documentation and API response DTOs across auth, chat, and taxonomy modules
- Enable SWC builder for faster NestJS compilation
- Implement JWT authentication strategy & identity middleware with CurrentUser decorator support
- Implement JWT authentication, role-based access control guards & password hashing in the auth
- Implement global API versioning, Winston logging, and Scalar API documentation
- Add Bruno API collection and centralize error constants with shared DTOs
- Implement request correlation IDs & a global HTTP exception filter for improved observability
- Implement frontend chat hook with API client and initialize Bruno API test collections
- Configure Nginx for production serving with optimized caching & security headers in Dockerfile
- Implement dynamic chat session initialization & constrain docker service resources
- Implement ownership verification for chat messages and improve UI accessibility and typography
- Refactor App to use ChatProvider and modular dashboard/chat compound components
- Integrate taxonomy metadata by adding new CSV datasets, updating Prisma schema
- Add response normalization interceptor, implement global rate limiting and db index
- Integrate Redis caching and optimize AI chat grounding with dynamic semantic search
- Initialize documentation site with MkDocs, deploy pipeline, and update service configurations
- Implement authentication system with login page
- Add taxonomy page, route navigation, chat hydration, and commit button state feedback
- Implement sidebar chat history and dynamic routing for persistent conversation management

<!-- generated by git-cliff -->
