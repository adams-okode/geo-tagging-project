"""
Companies API routes with CRUD operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.company import Company
from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanyListResponse,
)

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.get("/", response_model=CompanyListResponse)
async def get_companies(
    skip: int = 0,
    limit: int = 100,
    *,
    db: Session = Depends(get_db),
):
    """
    Retrieve a list of companies with pagination.

    Args:
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return
        db: Database session

    Returns:
        List of companies with total count
    """

    companies = db.query(Company).offset(skip).limit(limit).all()
    total = db.query(Company).count()

    return CompanyListResponse(companies=companies, total=total)


@router.post(
    "/",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_company(
    company: CompanyCreate,
    *,
    db: Session = Depends(get_db),
):
    """
    Create a new company record.

    Args:
        company: Company data to create
        db: Database session

    Returns:
        Created company data
    """

    # Create PostGIS point from coordinates
    db_company = Company(
        name=company.name,
        industry=company.industry,
        location=company.location,
        latitude=company.latitude,
        longitude=company.longitude,
    )

    db.add(db_company)
    db.commit()
    db.refresh(db_company)

    return db_company


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific company by ID.

    Args:
        company_id: Company ID
        db: Database session

    Returns:
        Company data
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Company not found"
        )
    return company


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int, db: Session = Depends(get_db)):
    """
    Delete a company by ID.

    Args:
        company_id: Company ID
        db: Database session

    Raises:
        HTTPException: If company not found or deletion fails
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Company not found"
        )

    try:
        db.delete(company)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete company: {str(e)}",
        )
