#!/bin/bash

# Quick Deploy Script for Railway
# This script helps you deploy the Solo Leveling app to Railway

set -e

echo "🚀 Solo Leveling - Railway Deployment Script"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

echo ""
echo "📦 Setting up project..."

# Initialize railway project if not already
if [ ! -f "railway.json" ]; then
    railway init
fi

echo ""
echo "🗄️  Creating databases..."
echo "Please create PostgreSQL and Redis in Railway dashboard if not done yet."
echo "Dashboard: https://railway.app/dashboard"
echo ""
read -p "Press Enter once databases are created..."

echo ""
echo "⚙️  Configuring environment variables..."
echo ""

# Function to set variable if not empty
set_variable() {
    local key=$1
    local value=$2
    if [ ! -z "$value" ]; then
        railway variables set "$key=$value"
    fi
}

# Get environment variables
read -p "Enter JWT_SECRET (min 32 chars): " jwt_secret
read -p "Enter TELEGRAM_BOT_TOKEN: " bot_token
read -p "Enter NODE_ENV [production]: " node_env
node_env=${node_env:-production}

# Set variables
set_variable "JWT_SECRET" "$jwt_secret"
set_variable "TELEGRAM_BOT_TOKEN" "$bot_token"
set_variable "NODE_ENV" "$node_env"
set_variable "PORT" "3001"

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔨 Building projects..."
pnpm db:generate
pnpm build

echo ""
echo "🚀 Deploying via Railway CLI..."
echo "⚠️  Note: Railway CLI deployment can be complex with monorepos."
echo "If this fails, use GitHub integration instead (push to GitHub)."
echo ""

# Try to deploy using Railway CLI
# Note: This may fail with monorepo setup - GitHub integration is more reliable
if railway status &> /dev/null; then
    echo "Triggering Railway deployment..."
    railway up || {
        echo ""
        echo "❌ Railway CLI deployment failed."
        echo ""
        echo "This is common with monorepo setups."
        echo ""
        echo "✅ RECOMMENDED SOLUTION:"
        echo "1. Push code to GitHub: git push origin main"
        echo "2. Railway will auto-deploy via GitHub integration"
        echo ""
        echo "See RAILWAY_DOCKER_SETUP.md for setup instructions."
        exit 1
    }
else
    echo "❌ Not linked to Railway project."
    echo ""
    echo "To link to Railway project:"
    echo "1. Run: railway link"
    echo "2. Select your project from the list"
    echo ""
    echo "OR (recommended):"
    echo "1. Use GitHub integration (automatic deployments)"
    echo "2. See RAILWAY_DOCKER_SETUP.md"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your API URL from Railway dashboard"
echo "2. Deploy frontend to Vercel (run ./scripts/deploy-vercel.sh)"
echo "3. Set up Telegram webhook with your API URL"
echo ""
echo "Railway Dashboard: https://railway.app/dashboard"
