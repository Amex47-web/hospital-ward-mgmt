from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_wards: int
    total_beds: int
    occupied_beds: int
    available_beds: int
