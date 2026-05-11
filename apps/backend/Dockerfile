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

# Install openssl
RUN apt-get update -y && apt-get install -y openssl

# Copy the entire workspace from the build stage to ensure nothing is missed
COPY --from=build /app .

# Enable pnpm and prune dev dependencies for production
RUN corepack enable
ENV CI=true
RUN pnpm install --prod --no-frozen-lockfile

# Ensure Prisma Client is generated for the production node_modules
RUN cd apps/backend && pnpm prisma generate --schema=prisma/schema.prisma

WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["sh", "-c", "pnpm run db:deploy && node dist/main.js"]
