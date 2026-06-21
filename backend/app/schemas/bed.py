import enum
from datetime import datetime

from pydantic import BaseModel, Field


class BedStatus(str, enum.Enum):
    available = "available"
    occupied = "occupied"
    maintenance = "maintenance"


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class BedCreate(BaseModel):
    bed_number: str = Field(min_length=1, max_length=50)


class BedUpdate(BaseModel):
    bed_number: str = Field(min_length=1, max_length=50)


class BedStatusUpdate(BaseModel):
    status: BedStatus


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class BedResponse(BaseModel):
    id: int
    ward_id: int
    bed_number: str
    status: str
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}
