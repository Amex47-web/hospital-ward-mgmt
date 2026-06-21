"""Beds router — CRUD + status transitions, with ownership enforced via parent ward."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.bed import BedCreate, BedResponse, BedStatusUpdate, BedUpdate
from app.services import bed_service

router = APIRouter(tags=["Beds"])


@router.get("/wards/{ward_id}/beds", response_model=list[BedResponse])
def list_beds(
    ward_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all beds in a ward."""
    return bed_service.list_beds(db, ward_id, current_user)


@router.post("/wards/{ward_id}/beds", response_model=BedResponse, status_code=status.HTTP_201_CREATED)
def create_bed(
    ward_id: int,
    data: BedCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new bed under a ward."""
    return bed_service.create_bed(db, ward_id, data, current_user)


@router.get("/beds/{bed_id}", response_model=BedResponse)
def get_bed(
    bed_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single bed's details."""
    return bed_service.get_bed(db, bed_id, current_user)


@router.put("/beds/{bed_id}", response_model=BedResponse)
def update_bed(
    bed_id: int,
    data: BedUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a bed's number."""
    return bed_service.update_bed(db, bed_id, data, current_user)


@router.patch("/beds/{bed_id}/status", response_model=BedResponse)
def update_bed_status(
    bed_id: int,
    data: BedStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a bed's status (available / occupied / maintenance)."""
    return bed_service.update_bed_status(db, bed_id, data, current_user)


@router.delete("/beds/{bed_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bed(
    bed_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a bed."""
    bed_service.delete_bed(db, bed_id, current_user)
