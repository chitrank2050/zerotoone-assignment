# --- Base Stage ---
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# --- Build Stage ---
FROM base AS build
# Install build dependencies
RUN apk add --no-cache python3 make g++

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter backend run db:generate
RUN pnpm --filter backend run build

# --- Production Stage ---
FROM node:24-alpine AS deploy
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable

# 1. Copy only the production-critical workspace files
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps/backend/package.json ./apps/backend/
COPY --from=build /app/packages/shared ./packages/shared

# 2. Install production-only dependencies
ENV CI=true
RUN pnpm install --prod --no-frozen-lockfile

# 3. Copy specific build artifacts and runtime configs
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=build /app/apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts
COPY --from=build /app/apps/backend/data ./apps/backend/data

# 4. Generate Prisma Client for production node_modules
RUN cd apps/backend && pnpm prisma generate --schema=prisma/schema.prisma

WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["sh", "-c", "pnpm run db:deploy && node dist/src/main.js"]
