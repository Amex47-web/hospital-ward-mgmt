"""Dashboard service — aggregated stats for the current user."""

from sqlalchemy.orm import Session

from app.repositories.bed_repository import get_dashboard_stats


def get_stats(db: Session, user_id: int) -> dict:
    """Return aggregate dashboard stats scoped to the user's wards."""
    return get_dashboard_stats(db, user_id)
