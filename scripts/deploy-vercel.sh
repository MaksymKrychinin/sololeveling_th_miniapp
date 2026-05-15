#!/bin/bash

# Quick Deploy Script for Vercel
# This script helps you deploy the frontend to Vercel

set -e

echo "🚀 Solo Leveling - Vercel Deployment Script"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    pnpm add -g vercel
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo ""
echo "⚙️  Setting up environment variables..."
echo ""

# Get environment variables
read -p "Enter API URL (e.g., https://your-api.railway.app): " api_url
read -p "Enter Telegram Bot Username (without @): " bot_username

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔨 Generating Prisma client..."
pnpm db:generate

echo ""
echo "🚀 Deploying to Vercel..."
cd apps/web

# Set environment variables
vercel env add VITE_API_URL production
echo "$api_url" | vercel env add VITE_API_URL production

vercel env add VITE_TELEGRAM_BOT_USERNAME production
echo "$bot_username" | vercel env add VITE_TELEGRAM_BOT_USERNAME production

# Deploy
vercel --prod

cd ../..

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Vercel URL from the output above"
echo "2. Configure Telegram Bot menu button with the URL"
echo "3. Set up webhook (run ./scripts/setup-telegram.sh)"
echo ""
