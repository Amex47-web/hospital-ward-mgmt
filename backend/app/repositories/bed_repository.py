"""Bed data-access functions.

Includes the single-query dashboard aggregation, which is the most
performance-critical query in the app.
"""

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models.bed import Bed
from app.models.ward import Ward


def get_beds_by_ward(db: Session, ward_id: int) -> list[Bed]:
    return (
        db.query(Bed)
        .filter(Bed.ward_id == ward_id)
        .order_by(Bed.bed_number)
        .all()
    )


def get_bed_by_id(db: Session, bed_id: int) -> Bed | None:
    return db.get(Bed, bed_id)


def get_bed_by_ward_and_number(db: Session, ward_id: int, bed_number: str) -> Bed | None:
    return (
        db.query(Bed)
        .filter(Bed.ward_id == ward_id, Bed.bed_number == bed_number)
        .first()
    )


def create_bed(db: Session, bed: Bed) -> Bed:
    db.add(bed)
    db.commit()
    db.refresh(bed)
    return bed


def update_bed(db: Session, bed: Bed) -> Bed:
    db.commit()
    db.refresh(bed)
    return bed


def delete_bed(db: Session, bed: Bed) -> None:
    db.delete(bed)
    db.commit()


def get_dashboard_stats(db: Session, user_id: int) -> dict:
    """Single aggregation query for all dashboard stats, scoped to user's wards.

    Uses LEFT JOIN so wards with zero beds still count toward total_wards.
    """
    result = (
        db.query(
            func.count(func.distinct(Ward.id)).label("total_wards"),
            func.count(Bed.id).label("total_beds"),
            func.count(case((Bed.status == "occupied", 1))).label("occupied_beds"),
            func.count(case((Bed.status == "available", 1))).label("available_beds"),
        )
        .select_from(Ward)
        .outerjoin(Bed, Bed.ward_id == Ward.id)
        .filter(Ward.created_by == user_id)
        .one()
    )
    return {
        "total_wards": result.total_wards,
        "total_beds": result.total_beds,
        "occupied_beds": result.occupied_beds,
        "available_beds": result.available_beds,
    }
