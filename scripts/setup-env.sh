#!/bin/bash

# Environment Setup Script
# Automatically generates .env file with secure defaults

set -e

echo "🔐 Solo Leveling - Environment Setup Wizard"
echo "==========================================="
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "Aborted. Existing .env file preserved."
        exit 0
    fi
    echo ""
fi

# Generate JWT Secret
echo "🔑 Generating JWT Secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo "✓ JWT Secret generated"
echo ""

# Get Telegram Bot Token
echo "🤖 Telegram Bot Setup"
echo "Need a bot token? Get one from @BotFather on Telegram:"
echo "  1. Open https://t.me/BotFather"
echo "  2. Send /newbot"
echo "  3. Follow instructions"
echo "  4. Copy the token"
echo ""
read -p "Enter your TELEGRAM_BOT_TOKEN: " BOT_TOKEN

if [ -z "$BOT_TOKEN" ]; then
    echo "❌ Bot token is required!"
    exit 1
fi

echo ""
echo "🗄️  Database Configuration"
read -p "Database URL [postgresql://postgres:postgres@localhost:5432/solo_leveling_dev]: " DB_URL
DB_URL=${DB_URL:-postgresql://postgres:postgres@localhost:5432/solo_leveling_dev}

echo ""
echo "🔴 Redis Configuration"
read -p "Redis URL [redis://localhost:6379]: " REDIS_URL_INPUT
REDIS_URL_INPUT=${REDIS_URL_INPUT:-redis://localhost:6379}

echo ""
echo "📝 Creating .env file..."

# Create .env file
cat > .env << EOF
# ============================================
# DATABASE
# ============================================
DATABASE_URL=$DB_URL

# ============================================
# REDIS
# ============================================
REDIS_URL=$REDIS_URL_INPUT

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=7d

# ============================================
# TELEGRAM BOT
# ============================================
TELEGRAM_BOT_TOKEN=$BOT_TOKEN

# ============================================
# APPLICATION
# ============================================
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# ============================================
# CORS (Frontend URL)
# ============================================
CORS_ORIGIN=http://localhost:3000

# ============================================
# WEB APP (Frontend Environment Variables)
# ============================================
# Note: Set these in apps/web/.env for local frontend development
# VITE_API_URL=http://localhost:3001
# VITE_TELEGRAM_BOT_USERNAME=your_bot_username
EOF

echo "✅ .env file created successfully!"
echo ""

# Create frontend .env if needed
if [ ! -f apps/web/.env ]; then
    echo "📱 Creating frontend .env file..."

    read -p "Enter your Telegram bot username (without @): " BOT_USERNAME

    cat > apps/web/.env << EOF
VITE_API_URL=http://localhost:3001
VITE_TELEGRAM_BOT_USERNAME=${BOT_USERNAME:-your_bot_username}
EOF

    echo "✅ Frontend .env created!"
    echo ""
fi

echo "============================================"
echo "✨ Setup Complete!"
echo "============================================"
echo ""
echo "Your secrets have been saved to .env"
echo ""
echo "🔐 Security Reminders:"
echo "  • Never commit .env to Git"
echo "  • Keep your bot token secret"
echo "  • Rotate secrets regularly"
echo ""
echo "📋 Next Steps:"
echo ""
echo "  1. Start services:"
echo "     pnpm docker:dev"
echo ""
echo "  2. Setup database:"
echo "     pnpm db:generate"
echo "     pnpm db:migrate"
echo "     pnpm db:seed"
echo ""
echo "  3. Start development:"
echo "     pnpm dev"
echo ""
echo "  4. Open app:"
echo "     http://localhost:3000"
echo ""
echo "📖 For deployment secrets, see: SECRETS_AND_VARS.md"
echo ""
