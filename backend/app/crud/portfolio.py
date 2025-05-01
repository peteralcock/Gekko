from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.portfolio import Portfolio, Holding
from app.schemas.portfolio import PortfolioUpdate, HoldingCreate

def get_portfolio_by_user_id(db: Session, user_id: int) -> Optional[Portfolio]:
    return db.query(Portfolio).filter(Portfolio.user_id == user_id).first()

def create_portfolio(db: Session, user_id: int) -> Portfolio:
    portfolio = Portfolio(
        user_id=user_id,
        total_value=0.0,
        last_updated=datetime.utcnow()
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    return portfolio

def update_portfolio(
    db: Session,
    *,
    db_obj: Portfolio,
    obj_in: PortfolioUpdate
) -> Portfolio:
    db_obj.total_value = obj_in.total_value
    db_obj.last_updated = datetime.utcnow()
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def create_holding(
    db: Session,
    *,
    holding_in: HoldingCreate,
    portfolio_id: int
) -> Holding:
    holding = Holding(
        portfolio_id=portfolio_id,
        symbol=holding_in.symbol,
        name=holding_in.name,
        shares=holding_in.shares,
        value=holding_in.value,
        allocation=holding_in.allocation,
        last_updated=datetime.utcnow()
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return holding 