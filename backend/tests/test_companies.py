"""
Tests for companies API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import get_db, Base
from app.models.company import Company


# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture
def test_db():
    """Create a test database session."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def sample_company_data():
    """Sample company data for testing."""
    return {
        "name": "Test Company",
        "industry": "Technology",
        "location": "San Francisco, CA",
        "latitude": 37.7749,
        "longitude": -122.4194
    }


class TestCompaniesAPI:
    """Test cases for companies API endpoints."""

    def test_get_companies_empty(self, test_db):
        """Test getting companies when database is empty."""
        response = client.get("/api/companies/")
        assert response.status_code == 200
        data = response.json()
        assert data["companies"] == []
        assert data["total"] == 0

    def test_create_company(self, test_db, sample_company_data):
        """Test creating a new company."""
        response = client.post("/api/companies/", json=sample_company_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_company_data["name"]
        assert data["industry"] == sample_company_data["industry"]
        assert data["location"] == sample_company_data["location"]
        assert data["latitude"] == sample_company_data["latitude"]
        assert data["longitude"] == sample_company_data["longitude"]
        assert "id" in data

    def test_create_company_invalid_coordinates(self, test_db):
        """Test creating company with invalid coordinates."""
        invalid_data = {
            "name": "Test Company",
            "industry": "Technology",
            "location": "Invalid Location",
            "latitude": 200.0,  # Invalid latitude
            "longitude": -122.4194
        }
        response = client.post("/api/companies/", json=invalid_data)
        assert response.status_code == 422

    def test_get_companies_with_data(self, test_db, sample_company_data):
        """Test getting companies when data exists."""
        # Create a company first
        client.post("/api/companies/", json=sample_company_data)
        
        response = client.get("/api/companies/")
        assert response.status_code == 200
        data = response.json()
        assert len(data["companies"]) == 1
        assert data["total"] == 1
        assert data["companies"][0]["name"] == sample_company_data["name"]

    def test_get_company_by_id(self, test_db, sample_company_data):
        """Test getting a specific company by ID."""
        # Create a company first
        create_response = client.post("/api/companies/", json=sample_company_data)
        company_id = create_response.json()["id"]
        
        response = client.get(f"/api/companies/{company_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == company_id
        assert data["name"] == sample_company_data["name"]

    def test_get_company_by_id_not_found(self, test_db):
        """Test getting a company that doesn't exist."""
        response = client.get("/api/companies/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Company not found"

    def test_delete_company(self, test_db, sample_company_data):
        """Test deleting a company."""
        # Create a company first
        create_response = client.post("/api/companies/", json=sample_company_data)
        company_id = create_response.json()["id"]
        
        response = client.delete(f"/api/companies/{company_id}")
        assert response.status_code == 204
        
        # Verify company is deleted
        get_response = client.get(f"/api/companies/{company_id}")
        assert get_response.status_code == 404

    def test_delete_company_not_found(self, test_db):
        """Test deleting a company that doesn't exist."""
        response = client.delete("/api/companies/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Company not found"

    def test_create_company_missing_fields(self, test_db):
        """Test creating company with missing required fields."""
        incomplete_data = {
            "name": "Test Company",
            "industry": "Technology"
            # Missing location, latitude, longitude
        }
        response = client.post("/api/companies/", json=incomplete_data)
        assert response.status_code == 422

    def test_create_company_empty_strings(self, test_db):
        """Test creating company with empty string fields."""
        empty_data = {
            "name": "",
            "industry": "",
            "location": "",
            "latitude": 37.7749,
            "longitude": -122.4194
        }
        response = client.post("/api/companies/", json=empty_data)
        assert response.status_code == 422


class TestRootEndpoints:
    """Test cases for root endpoints."""

    def test_root_endpoint(self):
        """Test the root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Geo-Tagging Company API"
        assert data["version"] == "1.0.0"

    def test_health_check(self):
        """Test the health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy" 