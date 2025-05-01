from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.db.session import get_db
import sys
import os

# Add the AI hedge fund engine to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../ai-hedge-fund-main'))

router = APIRouter()

@router.post("/", response_model=AgentResponse)
def create_agent(
    *,
    db: Session = Depends(get_db),
    agent_in: AgentCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new agent.
    """
    agent = Agent(
        user_id=current_user.id,
        name=agent_in.name,
        type=agent_in.type,
        configuration=agent_in.configuration,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent

@router.get("/", response_model=List[AgentResponse])
def read_agents(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve agents.
    """
    agents = db.query(Agent).filter(Agent.user_id == current_user.id).all()
    return agents

@router.get("/{agent_id}", response_model=AgentResponse)
def read_agent(
    *,
    db: Session = Depends(get_db),
    agent_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get agent by ID.
    """
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.user_id == current_user.id
    ).first()
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )
    return agent

@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent(
    *,
    db: Session = Depends(get_db),
    agent_id: int,
    agent_in: AgentUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update agent.
    """
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.user_id == current_user.id
    ).first()
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )
    
    for field, value in agent_in.dict(exclude_unset=True).items():
        setattr(agent, field, value)
    
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent

@router.post("/{agent_id}/analyze", response_model=dict)
def analyze_portfolio(
    *,
    db: Session = Depends(get_db),
    agent_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Run portfolio analysis using the specified agent.
    """
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.user_id == current_user.id
    ).first()
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )
    
    # Import the appropriate agent module based on the agent type
    try:
        agent_module = __import__(f"src.agents.{agent.name.lower().replace(' ', '_')}", fromlist=[''])
        analysis = agent_module.analyze_portfolio(
            portfolio=current_user.portfolio,
            configuration=agent.configuration
        )
        
        # Update agent's last run and performance metrics
        agent.last_run = analysis.get('timestamp')
        agent.performance_metrics = analysis.get('metrics')
        db.add(agent)
        db.commit()
        
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error running analysis: {str(e)}"
        ) 