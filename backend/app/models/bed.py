from datetime import datetime, timezone

from sqlalchemy import CheckConstraint, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Bed(Base):
    __tablename__ = "beds"
    __table_args__ = (
        UniqueConstraint("ward_id", "bed_number", name="uq_bed_ward_number"),
        CheckConstraint(
            "status IN ('available', 'occupied', 'maintenance')",
            name="ck_bed_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ward_id: Mapped[int] = mapped_column(
        ForeignKey("wards.id", ondelete="CASCADE"), nullable=False, index=True
    )
    bed_number: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="available", index=True)
    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime | None] = mapped_column(onupdate=func.now())

    # Relationships
    ward: Mapped["Ward"] = relationship(back_populates="beds")  # noqa: F821

    def __repr__(self) -> str:
        return f"<Bed id={self.id} number={self.bed_number} status={self.status}>"
