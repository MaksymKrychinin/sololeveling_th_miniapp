#!/bin/bash

# Telegram Bot Setup Script
# Configures webhook and commands for your Telegram bot

set -e

echo "🤖 Solo Leveling - Telegram Bot Setup"
echo ""

# Get configuration
read -p "Enter your TELEGRAM_BOT_TOKEN: " bot_token
read -p "Enter your API URL (e.g., https://your-api.railway.app): " api_url

webhook_url="${api_url}/api/v1/telegram/webhook"

echo ""
echo "🔗 Setting webhook..."
echo "Webhook URL: $webhook_url"

response=$(curl -s -X POST \
  "https://api.telegram.org/bot${bot_token}/setWebhook" \
  -H 'Content-Type: application/json' \
  -d "{\"url\": \"${webhook_url}\"}")

echo "Response: $response"

echo ""
echo "✅ Verifying webhook..."
webhook_info=$(curl -s "https://api.telegram.org/bot${bot_token}/getWebhookInfo")
echo "$webhook_info" | jq '.'

echo ""
echo "⚙️  Setting bot commands..."

commands_response=$(curl -s -X POST \
  "https://api.telegram.org/bot${bot_token}/setMyCommands" \
  -H 'Content-Type: application/json' \
  -d '{
    "commands": [
      {"command": "start", "description": "Start your journey as a hunter"},
      {"command": "profile", "description": "View your hunter profile"},
      {"command": "quests", "description": "View your active quests"},
      {"command": "achievements", "description": "View your achievements"},
      {"command": "leaderboard", "description": "View the rankings"},
      {"command": "stats", "description": "View your statistics"},
      {"command": "help", "description": "Get help and information"}
    ]
  }')

echo "Commands Response: $commands_response"

echo ""
echo "✅ Telegram bot configured successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to @BotFather on Telegram"
echo "2. Send /mybots"
echo "3. Select your bot"
echo "4. Bot Settings → Menu Button"
echo "5. Configure Menu Button"
echo "6. Set URL to your Vercel deployment"
echo ""
echo "🧪 Test your bot:"
echo "1. Open Telegram"
echo "2. Search for your bot"
echo "3. Click /start"
echo "4. Click the menu button"
echo ""
