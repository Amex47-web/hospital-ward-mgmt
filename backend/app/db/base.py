"""Declarative base for all SQLAlchemy models.

Models import Base from here. Alembic's env.py imports the models
separately so they register with Base.metadata for auto-generation.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

