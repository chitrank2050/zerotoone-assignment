# --- Base Stage ---
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install openssl for Prisma 7
RUN apt-get update -y && apt-get install -y openssl

COPY . /app
WORKDIR /app

# --- Build Stage ---
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter backend run db:generate
RUN pnpm --filter backend run build

# --- Production Stage ---
FROM node:24-slim AS deploy
WORKDIR /app

# Install openssl in deploy stage too
RUN apt-get update -y && apt-get install -y openssl

COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps/backend/package.json ./apps/backend/
COPY --from=build /app/packages/shared/package.json ./packages/shared/

RUN corepack enable
RUN pnpm install --prod --no-frozen-lockfile

# Copy built assets and prisma
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=build /app/packages/shared ./packages/shared

EXPOSE 3000
CMD ["sh", "-c", "pnpm --filter backend run db:deploy && node apps/backend/dist/main"]
