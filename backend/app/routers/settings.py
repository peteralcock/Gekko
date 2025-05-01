from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import deps
from app.crud import settings as settings_crud
from app.models.user import User
from app.schemas.settings import SettingsResponse, SettingsUpdate

router = APIRouter()

@router.get("/", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get current user's settings.
    """
    settings = settings_crud.get_settings_by_user_id(db, user_id=current_user.id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@router.put("/", response_model=SettingsResponse)
def update_settings(
    *,
    db: Session = Depends(deps.get_db),
    settings_in: SettingsUpdate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update user settings.
    """
    settings = settings_crud.get_settings_by_user_id(db, user_id=current_user.id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings_crud.update_settings(db=db, db_obj=settings, obj_in=settings_in)

@router.post("/api-key", response_model=SettingsResponse)
def generate_api_key(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Generate new API key.
    """
    settings = settings_crud.get_settings_by_user_id(db, user_id=current_user.id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings_crud.generate_api_key(db=db, db_obj=settings) 