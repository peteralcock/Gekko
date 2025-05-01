from sqlalchemy import Boolean, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    notifications_enabled = Column(Boolean, default=True)
    email_updates_enabled = Column(Boolean, default=True)
    dark_mode_enabled = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="settings") 