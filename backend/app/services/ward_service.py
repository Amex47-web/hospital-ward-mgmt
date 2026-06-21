"""Ward service — CRUD operations with ownership enforcement."""

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.user import User
from app.models.ward import Ward
from app.repositories import ward_repository
from app.schemas.ward import WardCreate, WardUpdate


def _get_owned_ward(db: Session, ward_id: int, user: User) -> Ward:
    """Fetch a ward and verify ownership. Returns 404 for both
    'not found' and 'not owned' to avoid leaking resource existence."""
    ward = ward_repository.get_ward_by_id(db, ward_id)
    if not ward or ward.created_by != user.id:
        raise NotFoundError(detail="Ward not found", error_code="WARD_NOT_FOUND")
    return ward


def list_wards(db: Session, user: User) -> list[dict]:
    """List all wards owned by the current user, with bed counts."""
    return ward_repository.get_wards_by_user(db, user.id)


def get_ward(db: Session, ward_id: int, user: User) -> Ward:
    """Get a single ward with its beds, after ownership check."""
    return _get_owned_ward(db, ward_id, user)


def create_ward(db: Session, data: WardCreate, user: User) -> Ward:
    ward = Ward(
        name=data.name,
        floor=data.floor,
        capacity=data.capacity,
        created_by=user.id,
    )
    return ward_repository.create_ward(db, ward)


def update_ward(db: Session, ward_id: int, data: WardUpdate, user: User) -> Ward:
    ward = _get_owned_ward(db, ward_id, user)
    ward.name = data.name
    ward.floor = data.floor
    ward.capacity = data.capacity
    return ward_repository.update_ward(db, ward)


def delete_ward(db: Session, ward_id: int, user: User) -> None:
    ward = _get_owned_ward(db, ward_id, user)
    ward_repository.delete_ward(db, ward)
