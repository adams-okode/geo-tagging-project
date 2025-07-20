# Geo-Tagging Company Management System

A full-stack web application for managing companies with geographic data, built with FastAPI (Python) and React (Next.js).

## Prerequisites

- Python 3.10+
- Node.js 20+
- Docker and Docker Compose (Docker version 28.0.4, build b8034c0)
- PostgreSQL with PostGIS extension (15+)
- Make [https://www.gnu.org/software/make/](https://www.gnu.org/software/make/)

## Quick Start

### Option 1: Automated Setup (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd geo-tagging-project
```

2. Set up project:
```bash
make setup
```

3. Start project
```bash
make start
```

4. Status
```bash
make status 
# Expected output 

📊 Project status:
docker compose ps
NAME                   IMAGE                          COMMAND                  SERVICE    CREATED              STATUS                        PORTS
geo_tagging_backend    geo-tagging-project-backend    "sh -c 'alembic upgr…"   backend    About a minute ago   Up About a minute (healthy)   0.0.0.0:8000->8000/tcp
geo_tagging_frontend   geo-tagging-project-frontend   "docker-entrypoint.s…"   frontend   About a minute ago   Up About a minute (healthy)   0.0.0.0:3000->3000/tcp
geo_tagging_postgres   postgis/postgis:15-3.3         "docker-entrypoint.s…"   postgres   5 minutes ago        Up 5 minutes (healthy)        0.0.0.0:5432->5432/tcp

Container health:
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
NAME                   STATUS                        PORTS
geo_tagging_backend    Up About a minute (healthy)   0.0.0.0:8000->8000/tcp
geo_tagging_frontend   Up About a minute (healthy)   0.0.0.0:3000->3000/tcp
geo_tagging_postgres   Up 5 minutes (healthy)        0.0.0.0:5432->5432/tcp
```

### Option 2: Manual Docker Compose Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd geo-tagging-project
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Update the `.env` file with your database credentials and other settings.

4. Start the application:
```bash
docker compose up --build
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up the database:
```bash
# Create PostgreSQL database with PostGIS extension
createdb geo_tagging_db
psql geo_tagging_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Run migrations
alembic upgrade head
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Companies

- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create a new company

### Company Schema

```json
{
  "name": "string",
  "industry": "string", 
  "location": "string",
  "latitude": "number",
  "longitude": "number"
}
```

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/geo_tagging_db
POSTGRES_DB=geo_tagging_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Logging
LOG_LEVEL=INFO
```

## License

MIT License 