from datetime import datetime

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class WardCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    floor: str | None = Field(default=None, max_length=50)
    capacity: int | None = Field(default=None, ge=0)


class WardUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    floor: str | None = Field(default=None, max_length=50)
    capacity: int | None = Field(default=None, ge=0)


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class WardResponse(BaseModel):
    id: int
    name: str
    floor: str | None
    capacity: int | None
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class WardListItem(BaseModel):
    """Ward summary for list endpoints — includes aggregated bed counts."""
    id: int
    name: str
    floor: str | None
    capacity: int | None
    bed_count: int = 0
    occupied_beds: int = 0
    available_beds: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class BedInWard(BaseModel):
    """Nested bed representation within a ward detail response."""
    id: int
    bed_number: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class WardDetailResponse(BaseModel):
    """Full ward detail with nested beds — used by GET /wards/{id}."""
    id: int
    name: str
    floor: str | None
    capacity: int | None
    created_at: datetime
    updated_at: datetime | None = None
    beds: list[BedInWard] = []

    model_config = {"from_attributes": True}
