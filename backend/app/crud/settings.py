import secrets
from typing import Optional
from sqlalchemy.orm import Session
from app.models.settings import UserSettings
from app.schemas.settings import SettingsUpdate

def get_settings_by_user_id(db: Session, user_id: int) -> Optional[UserSettings]:
    return db.query(UserSettings).filter(UserSettings.user_id == user_id).first()

def create_settings(db: Session, user_id: int) -> UserSettings:
    settings = UserSettings(
        user_id=user_id,
        notifications_enabled=True,
        email_updates_enabled=True,
        dark_mode_enabled=True
    )
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings

def update_settings(
    db: Session,
    *,
    db_obj: UserSettings,
    obj_in: SettingsUpdate
) -> UserSettings:
    db_obj.notifications_enabled = obj_in.notifications_enabled
    db_obj.email_updates_enabled = obj_in.email_updates_enabled
    db_obj.dark_mode_enabled = obj_in.dark_mode_enabled
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def generate_api_key(
    db: Session,
    *,
    db_obj: UserSettings
) -> UserSettings:
    api_key = secrets.token_urlsafe(32)
    db_obj.user.api_key = api_key
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj 