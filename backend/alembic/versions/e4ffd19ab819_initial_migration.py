"""Initial migration

Revision ID: e4ffd19ab819
Revises: 
Create Date: 2025-07-20 08:14:39.402806

"""

from alembic import op
import sqlalchemy as sa
from geoalchemy2.types import Geography


# revision identifiers, used by Alembic.
revision = "e4ffd19ab819"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "companies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("industry", sa.String(), nullable=False),
        sa.Column("location", sa.String(), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column(
            "geom",
            Geography(
                geometry_type="POINT",
                srid=4326,
                from_text="ST_GeogFromText",
                name="geography",
                nullable=False,
            ),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # Create spatial index with IF NOT EXISTS logic
    op.execute(
        "CREATE INDEX IF NOT EXISTS idx_companies_geom ON companies USING gist (geom)"
    )
    op.create_index(op.f("ix_companies_id"), "companies", ["id"], unique=False)
    op.create_index(op.f("ix_companies_name"), "companies", ["name"], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_companies_name"), table_name="companies")
    op.drop_index(op.f("ix_companies_id"), table_name="companies")
    # Drop spatial index with IF EXISTS logic
    op.execute("DROP INDEX IF EXISTS idx_companies_geom")
    op.drop_table("companies")
    # ### end Alembic commands ###
