"""
Company model with geographic data support using PostGIS.
"""

from sqlalchemy import Column, Integer, String, Float
from geoalchemy2 import Geography
from app.database import Base
from geoalchemy2.functions import ST_Point


class Company(Base):
    """
    Company model with geographic coordinates stored as PostGIS geometry.
    """

    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    industry = Column(String, nullable=False)
    location = Column(String, nullable=False)  # Human-readable location (city, address)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # PostGIS geometry column for spatial queries
    geom = Column(Geography(geometry_type="POINT", srid=4326), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Create PostGIS point from latitude and longitude
        if self.latitude is not None and self.longitude is not None:
            self.geom = ST_Point(self.longitude, self.latitude)

    def __repr__(self):
        return (
            f"<Company(id={self.id}, "
            f"name='{self.name}', "
            f"location='{self.location}', "
            f"latitude={self.latitude}, "
            f"longitude={self.longitude})>"
        )
