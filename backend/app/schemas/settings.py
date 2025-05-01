from pydantic import BaseModel

class SettingsBase(BaseModel):
    notifications_enabled: bool
    email_updates_enabled: bool
    dark_mode_enabled: bool

class SettingsUpdate(SettingsBase):
    pass

class SettingsResponse(SettingsBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True 