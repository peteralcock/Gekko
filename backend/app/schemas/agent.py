from typing import Optional, Dict, Any
from pydantic import BaseModel

class AgentBase(BaseModel):
    name: str
    type: str
    configuration: Dict[str, Any]

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class AgentResponse(AgentBase):
    id: int
    user_id: int
    is_active: bool
    last_run: Optional[str] = None
    performance_metrics: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True 