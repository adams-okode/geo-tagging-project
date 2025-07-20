# Geo-Tagging Project Makefile (Docker Compose Based)
# Usage: make <target>

.PHONY: help create-env setup start stop down clean backend-dev backend-build backend-test backend-migrate frontend-dev frontend-build frontend-test build-all

# Default target
help:
	@echo "Geo-Tagging Project Management (Docker Compose)"
	@echo ""
	@echo "Available commands:"
	@echo "  setup          - Initial project setup (build images, setup database)"
	@echo "  start          - Start the entire project (backend + frontend)"
	@echo "  stop           - Stop all running containers"
	@echo "  down           - Stop and remove containers, networks"
	@echo "  clean          - Stop, remove containers, networks, volumes, and images"
	@echo ""
	@echo "Build commands:"
	@echo "  build-all      - Build all Docker images"
	@echo "  backend-build  - Build backend Docker image"
	@echo "  frontend-build - Build frontend Docker image"
	@echo ""
	@echo "Development commands:"
	@echo "  backend-dev    - Start backend in development mode"
	@echo "  frontend-dev   - Start frontend in development mode"
	@echo "  backend-test   - Run backend tests in container"
	@echo "  frontend-test  - Run frontend tests in container"
	@echo "  backend-migrate - Run database migrations"
	@echo ""
	@echo "Database commands:"
	@echo "  db-reset       - Reset database (drop and recreate)"
	@echo "  db-shell       - Open PostgreSQL shell"
	@echo "  db-check       - Check database connection health"
	@echo "  wait-db        - Wait for database to be ready"
	@echo ""
	@echo "Monitoring:"
	@echo "  logs           - Show all project logs"
	@echo "  logs-backend   - Show backend logs only"
	@echo "  logs-frontend  - Show frontend logs only"
	@echo "  status         - Show project status"

# Project setup
create-env:
	@cp .env.example .env
	@echo "✅ .env file created!"

setup: create-env build-all wait-db
	@echo "✅ Project setup complete!"
	@echo "Run 'make start' to start the project"

# Build all Docker images
build-all:
	@echo "🏗️  Building all Docker images..."
	docker compose build
	@echo "✅ All images built!"

# Start the entire project
start:
	@echo "🚀 Starting Geo-Tagging Project..."
	docker compose up -d
	@echo "✅ Project started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "Database: localhost:5432"

# Stop all containers
stop:
	@echo "⏹️  Stopping containers..."
	docker compose stop
	@echo "✅ Containers stopped"

# Stop and remove containers, networks
down:
	@echo "🔄 Stopping and removing containers..."
	docker compose down
	@echo "✅ Containers and networks removed"

# Clean everything (containers, networks, volumes, images)
clean:
	@echo "🧹 Cleaning up project..."
	docker compose down -v --rmi all --remove-orphans
	@echo "✅ Project cleaned!"

# Backend commands
backend-dev:
	@echo "🔧 Starting backend in development mode..."
	docker compose up backend

backend-build:
	@echo "🏗️  Building backend Docker image..."
	docker compose build backend
	@echo "✅ Backend image built!"

backend-test:
	@echo "🧪 Running backend tests..."
	docker compose run --rm backend python -m pytest tests/ -v

backend-migrate:
	@echo "🗄️  Running database migrations..."
	@echo "Ensuring database is ready..."
	@until docker compose exec postgres pg_isready -U postgres 2>/dev/null; do sleep 2; done
	docker compose run --rm backend alembic upgrade head
	@echo "✅ Database migrations complete!"

backend-shell:
	@echo "🐍 Opening backend shell..."
	docker compose exec backend python

# Frontend commands
frontend-dev:
	@echo "🎨 Starting frontend in development mode..."
	docker compose up frontend

frontend-build:
	@echo "🏗️  Building frontend Docker image..."
	docker compose build frontend
	@echo "✅ Frontend image built!"

frontend-test:
	@echo "🧪 Running frontend tests..."
	docker compose run --rm frontend npm test

frontend-lint:
	@echo "🔍 Running frontend linting..."
	docker compose run --rm frontend npm run lint

# Database commands
db-reset:
	@echo "🔄 Resetting database..."
	docker compose down -v
	docker compose up -d postgres
	@echo "Waiting for database to be ready..."
	@echo "This may take a moment..."
	@until docker compose exec postgres pg_isready -U postgres; do sleep 2; done
	@echo "Database is ready!"
	docker compose run --rm backend alembic upgrade head
	@echo "✅ Database reset complete!"

db-shell:
	@echo "🗄️  Opening database shell..."
	docker compose exec postgres psql -U postgres -d geo_tagging

db-check:
	@echo "🔍 Checking database connection..."
	docker compose exec postgres pg_isready -U postgres
	@echo "✅ Database connection is healthy!"

# Logs
logs:
	@echo "📋 Showing project logs..."
	docker compose logs -f

logs-backend:
	@echo "📋 Showing backend logs..."
	docker compose logs -f backend

logs-frontend:
	@echo "📋 Showing frontend logs..."
	docker compose logs -f frontend

# Status
status:
	@echo "📊 Project status:"
	docker compose ps
	@echo ""
	@echo "Container health:"
	docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# Development mode (all services)
dev:
	@echo "🚀 Starting development mode..."
	docker compose up

# Wait for database to be ready
wait-db:
	@echo "⏳ Waiting for database to be ready..."
	@until docker compose exec postgres pg_isready -U postgres 2>/dev/null; do sleep 2; done
	@echo "✅ Database is ready!"
