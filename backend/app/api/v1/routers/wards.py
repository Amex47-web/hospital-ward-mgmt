"""Wards router — CRUD operations, all scoped to the authenticated user."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.ward import WardCreate, WardDetailResponse, WardListItem, WardResponse, WardUpdate
from app.services import ward_service

router = APIRouter(prefix="/wards", tags=["Wards"])


@router.get("", response_model=list[WardListItem])
def list_wards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all wards owned by the current user, with bed counts."""
    return ward_service.list_wards(db, current_user)


@router.post("", response_model=WardResponse, status_code=status.HTTP_201_CREATED)
def create_ward(
    data: WardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new ward under the current user."""
    return ward_service.create_ward(db, data, current_user)


@router.get("/{ward_id}", response_model=WardDetailResponse)
def get_ward(
    ward_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a ward's full details including its beds."""
    return ward_service.get_ward(db, ward_id, current_user)


@router.put("/{ward_id}", response_model=WardResponse)
def update_ward(
    ward_id: int,
    data: WardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a ward's details."""
    return ward_service.update_ward(db, ward_id, data, current_user)


@router.delete("/{ward_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ward(
    ward_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a ward and all its beds (cascade)."""
    ward_service.delete_ward(db, ward_id, current_user)
