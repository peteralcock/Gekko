from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import deps
from app.crud import portfolio as portfolio_crud
from app.models.user import User
from app.schemas.portfolio import (
    PortfolioResponse,
    PortfolioUpdate,
    HoldingCreate,
    HoldingResponse
)

router = APIRouter()

@router.get("/", response_model=PortfolioResponse)
def get_portfolio(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get current user's portfolio.
    """
    portfolio = portfolio_crud.get_portfolio_by_user_id(db, user_id=current_user.id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.get("/holdings", response_model=List[HoldingResponse])
def get_holdings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get current user's holdings.
    """
    portfolio = portfolio_crud.get_portfolio_by_user_id(db, user_id=current_user.id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio.holdings

@router.post("/holdings", response_model=HoldingResponse)
def create_holding(
    *,
    db: Session = Depends(deps.get_db),
    holding_in: HoldingCreate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Create new holding.
    """
    portfolio = portfolio_crud.get_portfolio_by_user_id(db, user_id=current_user.id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio_crud.create_holding(db=db, holding_in=holding_in, portfolio_id=portfolio.id)

@router.put("/", response_model=PortfolioResponse)
def update_portfolio(
    *,
    db: Session = Depends(deps.get_db),
    portfolio_in: PortfolioUpdate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update portfolio.
    """
    portfolio = portfolio_crud.get_portfolio_by_user_id(db, user_id=current_user.id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio_crud.update_portfolio(db=db, db_obj=portfolio, obj_in=portfolio_in) 