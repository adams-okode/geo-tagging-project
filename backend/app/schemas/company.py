"""
Pydantic schemas for company data validation and serialization.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class CompanyBase(BaseModel):
    """Base company schema with common fields."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Company name",
    )
    industry: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Company industry",
    )
    location: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Human-readable location",
    )
    latitude: float = Field(
        ...,
        ge=-90,
        le=90,
        description="Latitude coordinate",
    )
    longitude: float = Field(
        ...,
        ge=-180,
        le=180,
        description="Longitude coordinate",
    )

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v):
        """Validate latitude is within valid range."""
        if not -90 <= v <= 90:
            raise ValueError("Latitude must be between -90 and 90 degrees")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v):
        """Validate longitude is within valid range."""
        if not -180 <= v <= 180:
            raise ValueError("Longitude must be between -180 and 180 degrees")
        return v


class CompanyCreate(CompanyBase):
    """Schema for creating a new company."""

    class Config:
        """Pydantic configuration."""

        from_attributes = True


class CompanyUpdate(BaseModel):
    """Schema for updating an existing company."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    industry: Optional[str] = Field(None, min_length=1, max_length=255)
    location: Optional[str] = Field(None, min_length=1, max_length=500)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)


class CompanyResponse(CompanyBase):
    """Schema for company response data."""

    id: int

    class Config:
        """Pydantic configuration."""

        from_attributes = True
        json_encoders = {
            float: lambda v: round(v, 6)  # Round coordinates to 6 decimal places
        }


class CompanyListResponse(BaseModel):
    """Schema for list of companies response."""

    companies: list[CompanyResponse]
    total: int
