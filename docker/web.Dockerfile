# Build stage
FROM node:22.13.0-alpine AS build
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/telegram-sdk/package.json ./packages/telegram-sdk/
COPY packages/config/package.json ./packages/config/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build packages first
RUN pnpm --filter @solo-leveling/shared build
RUN pnpm --filter @solo-leveling/ui build
RUN pnpm --filter @solo-leveling/telegram-sdk build

# Build web app
ARG VITE_API_URL
ARG VITE_TELEGRAM_BOT_NAME
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TELEGRAM_BOT_NAME=$VITE_TELEGRAM_BOT_NAME

RUN pnpm --filter web build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Add non-root user
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
