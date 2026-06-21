"""Bed service — CRUD + status transitions with ownership enforcement."""

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.bed import Bed
from app.models.user import User
from app.repositories import bed_repository, ward_repository
from app.schemas.bed import BedCreate, BedStatusUpdate, BedUpdate


def _verify_ward_ownership(db: Session, ward_id: int, user: User):
    """Ensure the ward exists and is owned by the current user."""
    ward = ward_repository.get_ward_by_id(db, ward_id)
    if not ward or ward.created_by != user.id:
        raise NotFoundError(detail="Ward not found", error_code="WARD_NOT_FOUND")
    return ward


def _get_owned_bed(db: Session, bed_id: int, user: User) -> Bed:
    """Fetch a bed and verify ownership via its parent ward."""
    bed = bed_repository.get_bed_by_id(db, bed_id)
    if not bed:
        raise NotFoundError(detail="Bed not found", error_code="BED_NOT_FOUND")
    # Verify ownership through the parent ward
    ward = ward_repository.get_ward_by_id(db, bed.ward_id)
    if not ward or ward.created_by != user.id:
        raise NotFoundError(detail="Bed not found", error_code="BED_NOT_FOUND")
    return bed


def list_beds(db: Session, ward_id: int, user: User) -> list[Bed]:
    _verify_ward_ownership(db, ward_id, user)
    return bed_repository.get_beds_by_ward(db, ward_id)


def create_bed(db: Session, ward_id: int, data: BedCreate, user: User) -> Bed:
    ward = _verify_ward_ownership(db, ward_id, user)

    # Check capacity limit
    if ward.capacity is not None:
        current_beds = bed_repository.get_beds_by_ward(db, ward_id)
        if len(current_beds) >= ward.capacity:
            raise ConflictError(
                detail=f"Ward has reached its maximum capacity of {ward.capacity} beds",
                error_code="WARD_CAPACITY_REACHED",
            )

    # Check uniqueness of bed_number within this ward
    existing = bed_repository.get_bed_by_ward_and_number(db, ward_id, data.bed_number)
    if existing:
        raise ConflictError(
            detail=f"Bed number '{data.bed_number}' already exists in this ward",
            error_code="DUPLICATE_BED_NUMBER",
        )

    bed = Bed(ward_id=ward_id, bed_number=data.bed_number)
    return bed_repository.create_bed(db, bed)


def get_bed(db: Session, bed_id: int, user: User) -> Bed:
    return _get_owned_bed(db, bed_id, user)


def update_bed(db: Session, bed_id: int, data: BedUpdate, user: User) -> Bed:
    bed = _get_owned_bed(db, bed_id, user)

    # If bed_number is changing, check uniqueness within the ward
    if data.bed_number != bed.bed_number:
        existing = bed_repository.get_bed_by_ward_and_number(db, bed.ward_id, data.bed_number)
        if existing:
            raise ConflictError(
                detail=f"Bed number '{data.bed_number}' already exists in this ward",
                error_code="DUPLICATE_BED_NUMBER",
            )

    bed.bed_number = data.bed_number
    return bed_repository.update_bed(db, bed)


def update_bed_status(db: Session, bed_id: int, data: BedStatusUpdate, user: User) -> Bed:
    bed = _get_owned_bed(db, bed_id, user)
    bed.status = data.status.value
    return bed_repository.update_bed(db, bed)


def delete_bed(db: Session, bed_id: int, user: User) -> None:
    bed = _get_owned_bed(db, bed_id, user)
    bed_repository.delete_bed(db, bed)
