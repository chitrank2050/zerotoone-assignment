# --- Build Stage ---
FROM node:24-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build --filter frontend

# --- Production Stage ---
FROM nginx:stable-alpine AS deploy
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
# Copy custom nginx config if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
