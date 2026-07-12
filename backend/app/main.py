from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.database import init_db, close_db
from app.config import get_settings
import logging

settings = get_settings()
logging.basicConfig(level=logging.INFO if not settings.DEBUG else logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Odoo X API",
    description="Odoo X Backend API with JWT Authentication",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Initialize database connectivity on startup"""
    logger.info("Starting up Odoo X API...")
    try:
        await init_db()
        logger.info("Odoo X API startup completed successfully")
    except Exception as e:
        logger.warning(f"Database connection failed: {e}")
        logger.info("Odoo X API started in degraded mode (no database connectivity)")
        # Don't crash - allow app to start without database

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connections on shutdown"""
    logger.info("Shutting down Odoo X API...")
    await close_db()
    logger.info("Odoo X API shutdown completed")

# Include routers
from fastapi.middleware.cors import CORSMiddleware

# Configure CORS
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "https://ecosphereesb.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Odoo X API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "odoo-x-api",
        "version": "1.0.0"
    }