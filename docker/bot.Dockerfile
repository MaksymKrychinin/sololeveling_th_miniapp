# Optimized single-stage build for faster deployment
FROM node:22.13.0-alpine

WORKDIR /app

# Install system dependencies (cached unless Alpine version changes)
RUN apk add --no-cache openssl libc6-compat python3 make g++

# Enable pnpm (cached)
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy package files for dependency installation (better caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY packages/config/package.json ./packages/config/
COPY apps/bot/package.json ./apps/bot/

# Install ALL dependencies (cached unless package files change)
RUN HUSKY=0 pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build (only runs when source changes)
RUN pnpm --filter @solo-leveling/shared build && \
    pnpm --filter @solo-leveling/database db:generate && \
    pnpm --filter @solo-leveling/database build && \
    pnpm --filter bot build

# Remove dev dependencies to reduce image size
RUN pnpm prune --prod

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

CMD ["node", "apps/bot/dist/index.js"]
