from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, portfolio, settings, agents
from app.core.config import settings as app_settings

app = FastAPI(
    title=app_settings.PROJECT_NAME,
    openapi_url="/api/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["portfolio"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])

@app.get("/")
async def root():
    return {"message": "AI Hedge Fund API"} 