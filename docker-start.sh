#!/bin/bash

# Solo Leveling Telegram Mini App - Quick Start Script
# This script sets up and runs the entire application using Docker

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARN="⚠️"
INFO="ℹ️"

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARN} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        echo "Please install Docker from: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running!"
        echo "Please start Docker and try again."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed!"
        echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
        exit 1
    fi

    print_success "Docker and Docker Compose are installed"
}

check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."

        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env file"
            print_warning "Please edit .env file with your configuration"
            echo ""
            echo "Required variables:"
            echo "  - TELEGRAM_BOT_TOKEN (get from @BotFather)"
            echo "  - JWT_SECRET (generate a random secret)"
            echo ""
            read -p "Press Enter to continue after editing .env file..."
        else
            print_error ".env.example not found!"
            exit 1
        fi
    else
        print_success ".env file found"
    fi

    # Check for required variables
    source .env

    if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ "$TELEGRAM_BOT_TOKEN" = "your_telegram_bot_token_here" ]; then
        print_error "TELEGRAM_BOT_TOKEN is not set in .env file!"
        echo "Get your bot token from @BotFather on Telegram"
        exit 1
    fi

    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your_super_secret_jwt_key_change_this_in_production" ]; then
        print_warning "JWT_SECRET is using default value. Generating random secret..."
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
        if [ "$(uname)" = "Darwin" ]; then
            sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
        else
            sed -i "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
        fi
        print_success "Generated and saved JWT_SECRET"
    fi
}

show_menu() {
    print_header "Solo Leveling Telegram Mini App - Docker Quick Start"
    echo "Choose an option:"
    echo ""
    echo "  1) ${GREEN}Development Mode${NC} - Start with hot reload (recommended for development)"
    echo "  2) ${BLUE}Production Mode${NC} - Start optimized production build"
    echo "  3) ${YELLOW}Stop All${NC} - Stop all running containers"
    echo "  4) ${RED}Clean Up${NC} - Remove all containers, volumes, and images"
    echo "  5) ${BLUE}View Logs${NC} - Show container logs"
    echo "  6) ${BLUE}Database Shell${NC} - Connect to PostgreSQL"
    echo "  7) ${BLUE}Prisma Studio${NC} - Open database GUI"
    echo "  8) ${GREEN}Rebuild${NC} - Rebuild all images"
    echo "  9) Exit"
    echo ""
}

start_dev_mode() {
    print_header "${ROCKET} Starting in Development Mode"

    print_info "Building and starting containers..."
    docker-compose -f docker-compose.dev.yml up -d --build

    print_success "Containers started successfully!"
    echo ""
    echo "Services running at:"
    echo "  ${GREEN}Frontend:${NC}      http://localhost:5173"
    echo "  ${BLUE}Backend API:${NC}   http://localhost:3000"
    echo "  ${YELLOW}Prisma Studio:${NC} http://localhost:5555"
    echo "  ${BLUE}Database:${NC}      localhost:5432"
    echo ""
    echo "Use 'docker-compose -f docker-compose.dev.yml logs -f' to view logs"
}

start_prod_mode() {
    print_header "${ROCKET} Starting in Production Mode"

    print_info "Building and starting containers..."
    docker-compose up -d --build

    print_success "Containers started successfully!"
    echo ""
    echo "Services running at:"
    echo "  ${GREEN}Frontend:${NC}      http://localhost:80"
    echo "  ${BLUE}Backend API:${NC}   http://localhost:3000"
    echo "  ${BLUE}Database:${NC}      localhost:5432"
    echo ""
    echo "Use 'docker-compose logs -f' to view logs"
}

stop_all() {
    print_header "Stopping All Containers"

    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

    print_success "All containers stopped"
}

clean_up() {
    print_header "${RED} Cleaning Up"

    print_warning "This will remove all containers, volumes, and images!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Stopping containers..."
        docker-compose down -v 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true

        print_info "Removing images..."
        docker images | grep solo_leveling | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

        print_success "Cleanup complete!"
    else
        print_info "Cleanup cancelled"
    fi
}

view_logs() {
    print_header "Container Logs"
    echo "Choose which logs to view:"
    echo "  1) All containers"
    echo "  2) Frontend"
    echo "  3) Backend"
    echo "  4) Database"
    echo ""
    read -p "Choice (1-4): " log_choice

    case $log_choice in
        1)
            if [ -f docker-compose.dev.yml ] && docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
                docker-compose -f docker-compose.dev.yml logs -f
            else
                docker-compose logs -f
            fi
            ;;
        2)
            if [ -f docker-compose.dev.yml ] && docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
                docker-compose -f docker-compose.dev.yml logs -f frontend
            else
                docker-compose logs -f frontend
            fi
            ;;
        3)
            if [ -f docker-compose.dev.yml ] && docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
                docker-compose -f docker-compose.dev.yml logs -f backend
            else
                docker-compose logs -f backend
            fi
            ;;
        4)
            if [ -f docker-compose.dev.yml ] && docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
                docker-compose -f docker-compose.dev.yml logs -f postgres
            else
                docker-compose logs -f postgres
            fi
            ;;
        *)
            print_error "Invalid choice"
            ;;
    esac
}

database_shell() {
    print_header "PostgreSQL Shell"

    # Check which compose file is running
    if docker-compose -f docker-compose.dev.yml ps | grep -q "solo_leveling_db_dev"; then
        CONTAINER="solo_leveling_db_dev"
    elif docker-compose ps | grep -q "solo_leveling_db"; then
        CONTAINER="solo_leveling_db"
    else
        print_error "Database container is not running!"
        return 1
    fi

    print_info "Connecting to PostgreSQL..."
    docker exec -it $CONTAINER psql -U postgres -d solo_leveling_db
}

prisma_studio() {
    print_header "Opening Prisma Studio"

    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        print_info "Prisma Studio is running at: http://localhost:5555"

        # Try to open in browser
        if command -v open &> /dev/null; then
            open http://localhost:5555
        elif command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:5555
        else
            print_info "Please open http://localhost:5555 in your browser"
        fi
    else
        print_warning "Development mode is not running. Starting Prisma Studio separately..."
        docker-compose -f docker-compose.dev.yml --profile dev up -d prisma-studio
        sleep 3
        print_success "Prisma Studio started at: http://localhost:5555"
    fi
}

rebuild_all() {
    print_header "Rebuilding All Images"

    print_info "Stopping containers..."
    stop_all

    print_info "Rebuilding images (this may take a few minutes)..."
    docker-compose build --no-cache
    docker-compose -f docker-compose.dev.yml build --no-cache

    print_success "Rebuild complete!"
}

check_health() {
    print_header "Health Check"

    # Check frontend
    if curl -s http://localhost:5173/health &>/dev/null || curl -s http://localhost/health &>/dev/null; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend is not responding"
    fi

    # Check backend
    if curl -s http://localhost:3000/api/health &>/dev/null; then
        print_success "Backend is healthy"
    else
        print_warning "Backend is not responding"
    fi

    # Check database
    if docker-compose exec -T postgres pg_isready -U postgres &>/dev/null; then
        print_success "Database is healthy"
    else
        print_warning "Database is not responding"
    fi
}

# Main script
main() {
    clear

    # Check prerequisites
    check_docker
    check_env_file

    while true; do
        show_menu
        read -p "Enter your choice (1-9): " choice

        case $choice in
            1)
                start_dev_mode
                echo ""
                read -p "Press Enter to continue..."
                clear
                ;;
            2)
                start_prod_mode
                echo ""
                read -p "Press Enter to continue..."
                clear
                ;;
            3)
                stop_all
                echo ""
                read -p "Press Enter to continue..."
                clear
                ;;
            4)
                clean_up
                echo ""
                read -p "Press Enter to continue..."
                clear
                ;;
            5)
                view_logs
                ;;
            6)
                database_shell
                echo ""
                read -p "Press Enter to continue..."
                clear
                ;;
            7)
                prisma_studio
                echo ""
                read -p "Press Enter to continue..."
                clear
                ;;
            8)
                rebuild_all
                echo ""
                read -p "Press Enter to continue..."
                clear
                ;;
            9)
                print_info "Goodbye! ${ROCKET}"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please try again."
                sleep 2
                clear
                ;;
        esac
    done
}

# Run main function
main
