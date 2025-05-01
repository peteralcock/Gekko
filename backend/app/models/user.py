from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    api_key = Column(String, unique=True, nullable=True)
    
    # Relationships
    portfolio = relationship("Portfolio", back_populates="user")
    settings = relationship("UserSettings", back_populates="user", uselist=False)
    agents = relationship("Agent", back_populates="user") 