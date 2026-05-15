# Base stage
FROM node:22.13.0-alpine AS base
# Install OpenSSL and other dependencies required by Prisma and native modules
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY packages/config/package.json ./packages/config/
COPY apps/bot/package.json ./apps/bot/
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
# Install build dependencies
RUN apk add --no-cache python3 make g++
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @solo-leveling/shared build
RUN pnpm --filter @solo-leveling/database db:generate
RUN pnpm --filter bot build

# Production stage
FROM node:22.13.0-alpine AS production
WORKDIR /app

# Install runtime dependencies (OpenSSL for Prisma) and build tools for native modules
RUN apk add --no-cache openssl libc6-compat python3 make g++

# Install only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY packages/config/package.json ./packages/config/
COPY apps/bot/package.json ./apps/bot/
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate && \
    pnpm install --frozen-lockfile --prod

# Copy built files
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/database/dist ./packages/database/dist
COPY --from=build /app/packages/database/prisma ./packages/database/prisma
COPY --from=build /app/apps/bot/dist ./apps/bot/dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Add non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "apps/bot/dist/index.js"]
