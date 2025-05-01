from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)  # e.g., "Warren Buffett", "Technical Analysis"
    type = Column(String)  # e.g., "fundamental", "technical", "sentiment"
    is_active = Column(Boolean, default=True)
    configuration = Column(JSON)  # Store agent-specific configuration
    last_run = Column(String, nullable=True)  # Timestamp of last analysis
    performance_metrics = Column(JSON, nullable=True)  # Store historical performance

    # Relationships
    user = relationship("User", back_populates="agents")
    portfolio = relationship("Portfolio", back_populates="agent") 