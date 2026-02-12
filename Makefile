.PHONY: help build build-frontend build-backend run dev test clean setup deploy logs status

# Default target
.DEFAULT_GOAL := help

# Variables
COMPOSE_FILE_DEV := config/docker-compose.separated.yml
COMPOSE_FILE_PROD := config/docker-compose.production.yml
ENV_DEV := config/.env.development
ENV_PROD := config/.env.production

# Help
help: ## Show this help message
	@echo "🎥 CCTV NVR Monitoring System"
	@echo ""
	@echo "📋 Available Commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Setup
setup: ## Initialize the project environment
	@echo "🔧 Setting up NVR Monitoring environment..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating development environment file..."; \
		cp $(ENV_DEV) .env; \
		echo "✅ Development .env created"; \
	else \
		echo "ℹ️  .env already exists"; \
	fi
	@echo "📦 Installing dependencies..."
	@cd cctv-nvr-monitor-frontend && npm install
	@cd cctv-nvr-monitor-backend && npm install
	@echo "✅ Setup complete!"

# Development
dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	docker-compose -f $(COMPOSE_FILE_DEV) up --build

dev-detach: ## Start development in background
	@echo "🚀 Starting development environment (detached)..."
	docker-compose -f $(COMPOSE_FILE_DEV) up -d --build

# Build
build: build-frontend build-backend ## Build all Docker images

build-frontend: ## Build frontend Docker image
	@echo "📦 Building frontend..."
	docker build -t cctv-nvr-frontend:latest ./cctv-nvr-monitor-frontend
	@echo "✅ Frontend built successfully"

build-backend: ## Build backend Docker image
	@echo "📦 Building backend..."
	docker build -t cctv-nvr-backend:latest ./cctv-nvr-monitor-backend
	@echo "✅ Backend built successfully"

build-prod: ## Build production images
	@echo "🏭 Building production images..."
	docker build -t cctv-nvr-frontend:prod --target production ./cctv-nvr-monitor-frontend
	docker build -t cctv-nvr-backend:prod --target production ./cctv-nvr-monitor-backend
	@echo "✅ Production images built"

# Run
run: ## Run development services
	@echo "� Starting services..."
	docker-compose -f $(COMPOSE_FILE_DEV) up -d

run-prod: ## Run production services
	@echo "🏭 Starting production services..."
	@if [ ! -f .env ]; then \
		echo "❌ Production .env not found. Copy from config/.env.production"; \
		exit 1; \
	fi
	docker-compose -f $(COMPOSE_FILE_PROD) up -d

# Stop
stop: ## Stop all services
	@echo "🛑 Stopping services..."
	docker-compose -f $(COMPOSE_FILE_DEV) down
	docker-compose -f $(COMPOSE_FILE_PROD) down 2>/dev/null || true

# Logs
logs: ## Show logs from running services
	docker-compose -f $(COMPOSE_FILE_DEV) logs -f

logs-prod: ## Show production logs
	docker-compose -f $(COMPOSE_FILE_PROD) logs -f

# Status
status: ## Show status of all services
	@echo "📊 Service Status:"
	@docker-compose -f $(COMPOSE_FILE_DEV) ps
	@echo ""
	@echo "� Docker Images:"
	@docker images | grep cctv-nvr || echo "No images found"

# Test
test: ## Run tests
	@echo "🧪 Running tests..."
	@cd cctv-nvr-monitor-frontend && npm test
	@cd cctv-nvr-monitor-backend && npm test

# Clean
clean: ## Clean up Docker resources
	@echo "🧹 Cleaning up..."
	@docker-compose -f $(COMPOSE_FILE_DEV) down -v
	@docker-compose -f $(COMPOSE_FILE_PROD) down -v 2>/dev/null || true
	@docker rmi cctv-nvr-frontend:latest cctv-nvr-backend:latest 2>/dev/null || true
	@docker rmi cctv-nvr-frontend:prod cctv-nvr-backend:prod 2>/dev/null || true
	@docker system prune -f
	@echo "✅ Cleanup complete"

# Backup
backup: ## Backup database
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	@docker-compose -f $(COMPOSE_FILE_DEV) exec postgres pg_dump -U postgres cctv_nvr_monitor > backups/backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "✅ Backup created"

# Restore
restore: ## Restore database (usage: make restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "❌ Please specify backup file: make restore FILE=backup.sql"; \
		exit 1; \
	fi
	@echo "🔄 Restoring database from $(FILE)..."
	@docker-compose -f $(COMPOSE_FILE_DEV) exec -T postgres psql -U postgres cctv_nvr_monitor < $(FILE)
	@echo "✅ Database restored"

# Deploy
deploy: ## Deploy to production
	@echo "🚀 Deploying to production..."
	@make stop
	@make build-prod
	@make run-prod
	@echo "✅ Deployment complete"

# Health Check
health: ## Check system health
	@echo "🏥 Checking system health..."
	@curl -f http://localhost:3001/health 2>/dev/null && echo "✅ Backend: Healthy" || echo "❌ Backend: Unhealthy"
	@curl -f http://localhost:3000 2>/dev/null && echo "✅ Frontend: Healthy" || echo "❌ Frontend: Unhealthy"
