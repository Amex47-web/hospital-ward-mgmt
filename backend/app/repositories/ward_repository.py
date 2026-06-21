"""Ward data-access functions.

Plain functions (not classes) — SQLAlchemy Session is already a reasonable
data-access abstraction at this scale. These exist to keep raw queries out
of the service layer, not to build a full Repository pattern.
"""

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models.bed import Bed
from app.models.ward import Ward


def get_wards_by_user(db: Session, user_id: int) -> list[dict]:
    """Return all wards owned by `user_id` with aggregated bed counts by status."""
    rows = (
        db.query(
            Ward.id,
            Ward.name,
            Ward.floor,
            Ward.capacity,
            Ward.created_at,
            func.count(Bed.id).label("bed_count"),
            func.count(case((Bed.status == "occupied", 1))).label("occupied_beds"),
            func.count(case((Bed.status == "available", 1))).label("available_beds"),
        )
        .outerjoin(Bed, Bed.ward_id == Ward.id)
        .filter(Ward.created_by == user_id)
        .group_by(Ward.id)
        .order_by(Ward.created_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "name": r.name,
            "floor": r.floor,
            "capacity": r.capacity,
            "created_at": r.created_at,
            "bed_count": r.bed_count,
            "occupied_beds": r.occupied_beds,
            "available_beds": r.available_beds,
        }
        for r in rows
    ]


def get_ward_by_id(db: Session, ward_id: int) -> Ward | None:
    return db.get(Ward, ward_id)


def create_ward(db: Session, ward: Ward) -> Ward:
    db.add(ward)
    db.commit()
    db.refresh(ward)
    return ward


def update_ward(db: Session, ward: Ward) -> Ward:
    db.commit()
    db.refresh(ward)
    return ward


def delete_ward(db: Session, ward: Ward) -> None:
    db.delete(ward)
    db.commit()
