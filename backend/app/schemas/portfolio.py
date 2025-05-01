from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class HoldingBase(BaseModel):
    symbol: str
    name: str
    shares: float
    value: float
    allocation: float

class HoldingCreate(HoldingBase):
    pass

class HoldingResponse(HoldingBase):
    id: int
    portfolio_id: int
    last_updated: datetime

    class Config:
        from_attributes = True

class PortfolioBase(BaseModel):
    total_value: float

class PortfolioUpdate(PortfolioBase):
    pass

class PortfolioResponse(PortfolioBase):
    id: int
    user_id: int
    last_updated: datetime
    holdings: List[HoldingResponse]

    class Config:
        from_attributes = True 