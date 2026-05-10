.PHONY: help dev prod start stop restart logs clean build rebuild db-shell prisma-studio health test

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
BLUE   := $(shell tput -Txterm setaf 4)
RESET  := $(shell tput -Txterm sgr0)

## help: Show this help message
help:
	@echo ''
	@echo '${BLUE}Solo Leveling Telegram Mini App - Make Commands${RESET}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "  ${YELLOW}%-20s${RESET}%s\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${BLUE}%-20s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)

## Development Commands

## dev: Start in development mode (with hot reload)
dev:
	@echo "${GREEN}Starting in development mode...${RESET}"
	docker-compose -f docker-compose.dev.yml up -d
	@echo "${GREEN}Services started!${RESET}"
	@echo "Frontend:      ${BLUE}http://localhost:5173${RESET}"
	@echo "Backend:       ${BLUE}http://localhost:3000${RESET}"
	@echo "Prisma Studio: ${BLUE}http://localhost:5555${RESET}"

## prod: Start in production mode
prod:
	@echo "${GREEN}Starting in production mode...${RESET}"
	docker-compose up -d
	@echo "${GREEN}Services started!${RESET}"
	@echo "Frontend: ${BLUE}http://localhost${RESET}"
	@echo "Backend:  ${BLUE}http://localhost:3000${RESET}"

## Container Management

## start: Start all services (alias for dev)
start: dev

## stop: Stop all services
stop:
	@echo "${YELLOW}Stopping all services...${RESET}"
	docker-compose down 2>/dev/null || true
	docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
	@echo "${GREEN}All services stopped${RESET}"

## restart: Restart all services
restart: stop dev

## logs: Show logs for all services
logs:
	docker-compose logs -f

## logs-backend: Show backend logs
logs-backend:
	docker-compose logs -f backend

## logs-frontend: Show frontend logs
logs-frontend:
	docker-compose logs -f frontend

## logs-db: Show database logs
logs-db:
	docker-compose logs -f postgres

## Build Commands

## build: Build all images
build:
	@echo "${GREEN}Building images...${RESET}"
	docker-compose build
	docker-compose -f docker-compose.dev.yml build
	@echo "${GREEN}Build complete!${RESET}"

## rebuild: Rebuild all images without cache
rebuild:
	@echo "${GREEN}Rebuilding images without cache...${RESET}"
	docker-compose build --no-cache
	docker-compose -f docker-compose.dev.yml build --no-cache
	@echo "${GREEN}Rebuild complete!${RESET}"

## Database Commands

## db-shell: Open PostgreSQL shell
db-shell:
	@echo "${BLUE}Connecting to PostgreSQL...${RESET}"
	docker-compose exec postgres psql -U postgres -d solo_leveling_db

## db-backup: Backup database to backup.sql
db-backup:
	@echo "${BLUE}Backing up database...${RESET}"
	docker-compose exec postgres pg_dump -U postgres solo_leveling_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "${GREEN}Database backed up!${RESET}"

## db-restore: Restore database from backup.sql
db-restore:
	@echo "${YELLOW}Restoring database from backup.sql...${RESET}"
	docker-compose exec -T postgres psql -U postgres -d solo_leveling_db < backup.sql
	@echo "${GREEN}Database restored!${RESET}"

## Prisma Commands

## prisma-studio: Open Prisma Studio
prisma-studio:
	@echo "${BLUE}Opening Prisma Studio at http://localhost:5555${RESET}"
	docker-compose -f docker-compose.dev.yml up -d prisma-studio
	@sleep 2
	@command -v open >/dev/null 2>&1 && open http://localhost:5555 || echo "Open http://localhost:5555 in your browser"

## prisma-migrate: Run Prisma migrations
prisma-migrate:
	@echo "${BLUE}Running Prisma migrations...${RESET}"
	docker-compose exec backend npx prisma migrate deploy
	@echo "${GREEN}Migrations complete!${RESET}"

## prisma-generate: Generate Prisma client
prisma-generate:
	@echo "${BLUE}Generating Prisma client...${RESET}"
	docker-compose exec backend npx prisma generate
	@echo "${GREEN}Prisma client generated!${RESET}"

## prisma-seed: Seed database
prisma-seed:
	@echo "${BLUE}Seeding database...${RESET}"
	docker-compose exec backend npx prisma db seed
	@echo "${GREEN}Database seeded!${RESET}"

## prisma-reset: Reset database (⚠️  deletes all data)
prisma-reset:
	@echo "${YELLOW}⚠️  This will delete all data! Press Ctrl+C to cancel...${RESET}"
	@sleep 3
	docker-compose exec backend npx prisma migrate reset
	@echo "${GREEN}Database reset!${RESET}"

## Testing & Quality

## test: Run tests
test:
	docker-compose exec backend npm test

## lint: Run linter
lint:
	docker-compose exec frontend npm run lint
	docker-compose exec backend npm run lint

## format: Format code
format:
	docker-compose exec frontend npm run format
	docker-compose exec backend npm run format

## Health & Monitoring

## health: Check health of all services
health:
	@echo "${BLUE}Checking service health...${RESET}"
	@echo -n "Frontend: "
	@curl -s http://localhost:5173/health >/dev/null 2>&1 && echo "${GREEN}✓ Healthy${RESET}" || echo "${YELLOW}✗ Not responding${RESET}"
	@echo -n "Backend:  "
	@curl -s http://localhost:3000/api/health >/dev/null 2>&1 && echo "${GREEN}✓ Healthy${RESET}" || echo "${YELLOW}✗ Not responding${RESET}"
	@echo -n "Database: "
	@docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1 && echo "${GREEN}✓ Healthy${RESET}" || echo "${YELLOW}✗ Not responding${RESET}"

## status: Show status of all containers
status:
	@docker-compose ps

## stats: Show resource usage
stats:
	docker stats

## Cleanup Commands

## clean: Remove containers (keeps volumes)
clean:
	@echo "${YELLOW}Removing containers...${RESET}"
	docker-compose down --remove-orphans
	docker-compose -f docker-compose.dev.yml down --remove-orphans
	@echo "${GREEN}Containers removed${RESET}"

## clean-all: Remove containers and volumes (⚠️  deletes database)
clean-all:
	@echo "${YELLOW}⚠️  This will delete the database! Press Ctrl+C to cancel...${RESET}"
	@sleep 3
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	@echo "${GREEN}Containers and volumes removed${RESET}"

## clean-images: Remove all project images
clean-images:
	@echo "${YELLOW}Removing project images...${RESET}"
	docker images | grep solo_leveling | awk '{print $$3}' | xargs docker rmi -f 2>/dev/null || true
	@echo "${GREEN}Images removed${RESET}"

## nuke: Complete cleanup (⚠️  removes everything)
nuke: clean-all clean-images
	@echo "${YELLOW}Cleaning up Docker system...${RESET}"
	docker system prune -a -f
	@echo "${GREEN}Complete cleanup done!${RESET}"

## Setup Commands

## setup: First-time setup (dev mode)
setup:
	@echo "${GREEN}Setting up Solo Leveling App...${RESET}"
	@if [ ! -f .env ]; then \
		echo "${YELLOW}Creating .env file...${RESET}"; \
		cp .env.example .env; \
		echo "${GREEN}.env created. Please edit with your values.${RESET}"; \
	else \
		echo "${GREEN}.env file already exists${RESET}"; \
	fi
	@echo "${BLUE}Building images...${RESET}"
	@$(MAKE) build
	@echo "${BLUE}Starting services...${RESET}"
	@$(MAKE) dev
	@sleep 5
	@echo ""
	@echo "${GREEN}Setup complete!${RESET}"
	@echo ""
	@echo "Services running at:"
	@echo "  Frontend:      ${BLUE}http://localhost:5173${RESET}"
	@echo "  Backend:       ${BLUE}http://localhost:3000${RESET}"
	@echo "  Prisma Studio: ${BLUE}http://localhost:5555${RESET}"
	@echo ""
	@echo "Run '${YELLOW}make help${RESET}' to see all available commands"

## install: Install dependencies (non-Docker)
install:
	npm install

## init-db: Initialize database (non-Docker)
init-db:
	npx prisma generate
	npx prisma migrate dev
	npx prisma db seed

## Utility Commands

## shell-backend: Open shell in backend container
shell-backend:
	docker-compose exec backend sh

## shell-frontend: Open shell in frontend container
shell-frontend:
	docker-compose exec frontend sh

## shell-db: Open shell in database container
shell-db:
	docker-compose exec postgres sh

## update: Pull latest changes and rebuild
update:
	@echo "${BLUE}Pulling latest changes...${RESET}"
	git pull origin main
	@echo "${BLUE}Stopping services...${RESET}"
	@$(MAKE) stop
	@echo "${BLUE}Rebuilding...${RESET}"
	@$(MAKE) rebuild
	@echo "${BLUE}Starting services...${RESET}"
	@$(MAKE) dev
	@echo "${GREEN}Update complete!${RESET}"
