#!/bin/bash

# Database Setup Script
# Runs migrations and seeds the database

set -e

echo "🗄️  Solo Leveling - Database Setup"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found in environment"
    read -p "Enter your DATABASE_URL: " database_url
    export DATABASE_URL="$database_url"
fi

echo "Database: $DATABASE_URL"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma Client
echo "🔨 Generating Prisma client..."
pnpm db:generate

# Run migrations
echo "🔄 Running migrations..."
pnpm db:migrate

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📊 Database contents:"
echo ""
pnpm db:studio &
STUDIO_PID=$!

echo ""
echo "Prisma Studio started at http://localhost:5555"
echo "Press Ctrl+C to stop"
echo ""

wait $STUDIO_PID
