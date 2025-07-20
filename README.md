# Geo-Tagging Company Management System

A full-stack web application for managing companies with geographic data, built with FastAPI (Python) and React (Next.js).

## Features

### Backend (FastAPI)
- **REST API**: Complete CRUD operations for companies
- **PostgreSQL with PostGIS**: Geographic data storage with spatial queries
- **Input Validation**: Comprehensive data validation using Pydantic
- **Error Handling**: Proper HTTP status codes and error messages
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Database Migrations**: Alembic for schema management
- **Testing**: Comprehensive test suite with pytest

### Frontend (Next.js + React)
- **Interactive Map**: Leaflet-based map with company markers
- **Company Management**: Add, view, and manage companies
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Client-side validation with react-hook-form
- **Geolocation**: Automatic coordinate detection
- **Real-time Updates**: Live data synchronization
- **Error Handling**: User-friendly error messages and loading states

### Database (PostgreSQL + PostGIS)
- **Geographic Data**: Store latitude/longitude with PostGIS geometry
- **Spatial Queries**: Efficient geographic data querying
- **Data Integrity**: Proper constraints and validation
- **Scalability**: Optimized for large datasets

### Deployment & DevOps
- **Docker**: Containerized application with multi-stage builds
- **Docker Compose**: Local development and production setups
- **Kubernetes**: Complete K8s manifests for production deployment
- **Health Checks**: Built-in health monitoring
- **Environment Management**: Flexible configuration management

## Project Structure

```
geo-tagging-project/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routes/         # API routes
│   │   ├── database.py     # Database configuration
│   │   └── main.py         # FastAPI application
│   ├── alembic/            # Database migrations
│   ├── tests/              # Backend tests
│   ├── Dockerfile          # Backend Dockerfile
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   └── styles/         # CSS styles
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend Dockerfile
│   └── package.json        # Node.js dependencies
├── docker-compose.yml      # Local development setup
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- Docker and Docker Compose
- PostgreSQL with PostGIS extension

## Quick Start

### Option 1: Automated Setup (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd geo-tagging-project
```

2. Run the automated setup script:
```bash
./setup.sh
```

This script will:
- Check system requirements (Docker, Docker Compose)
- Set up environment variables
- Install dependencies for both backend and frontend
- Build Docker images
- Start all services
- Provide access URLs

3. Test the setup (optional):
```bash
./test-setup.sh
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
docker-compose up --build
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

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Deployment

### Docker Production

Build and run with Docker Compose for production:

```bash
# Copy environment file
cp env.example .env

# Start production services
docker-compose -f docker-compose.prod.yml up --build -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Kubernetes

1. Build and push Docker images to your registry:
```bash
# Build images
docker build -t your-registry/geo-tagging-backend:latest ./backend
docker build -t your-registry/geo-tagging-frontend:latest ./frontend

# Push images
docker push your-registry/geo-tagging-backend:latest
docker push your-registry/geo-tagging-frontend:latest
```

2. Update the Kubernetes manifests with your image registry:
```bash
# Update image references in k8s/backend-deployment.yaml and k8s/frontend-deployment.yaml
# Change imagePullPolicy from "Never" to "Always"
# Update image names to your registry
```

3. Apply Kubernetes manifests:
```bash
kubectl apply -f k8s/
```

4. Check deployment status:
```bash
kubectl get pods -n geo-tagging
kubectl get services -n geo-tagging
```

### Local Development with Kubernetes

For local development with Minikube or Docker Desktop:

1. Enable Kubernetes in Docker Desktop or start Minikube
2. Build images locally:
```bash
docker build -t geo-tagging-backend:latest ./backend
docker build -t geo-tagging-frontend:latest ./frontend
```
3. Apply manifests (images will be pulled from local registry)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Ensure PostgreSQL is running and accessible
- Check database credentials in `.env` file
- Verify PostGIS extension is installed: `psql -d geo_tagging_db -c "SELECT PostGIS_Version();"`

#### Port Conflicts
- Check if ports 3000, 8000, or 5432 are already in use
- Stop conflicting services or change ports in `.env` file

#### Docker Issues
- Ensure Docker and Docker Compose are installed and running
- Try rebuilding images: `docker-compose build --no-cache`
- Check container logs: `docker-compose logs [service-name]`
- For ARM64 Macs: Use the standard PostGIS image (already configured)
- Clear Docker cache: `docker system prune -a`

#### Frontend Build Issues
- Clear Next.js cache: `rm -rf frontend/.next`
- Reinstall dependencies: `cd frontend && rm -rf node_modules && npm install`

#### Backend Migration Issues
- Reset database: `docker-compose down -v && docker-compose up`
- Run migrations manually: `cd backend && alembic upgrade head`

### Performance Optimization

#### Database
- Add indexes for frequently queried columns
- Use spatial indexes for geographic queries
- Consider connection pooling for high traffic

#### Frontend
- Enable Next.js production mode
- Optimize bundle size with code splitting
- Use CDN for map tiles

#### Backend
- Enable FastAPI production mode
- Use multiple workers with uvicorn
- Implement caching for frequently accessed data

## License

MIT License 