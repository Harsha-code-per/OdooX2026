from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from sqlalchemy.engine.url import make_url
from fastapi import HTTPException
from app.config import get_settings
import logging
import asyncio
import ssl

settings = get_settings()
logger = logging.getLogger(__name__)

# Create SSL context for Azure PostgreSQL
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Use the DATABASE_URL directly since it already has the async driver
database_url = make_url(settings.DATABASE_URL)
logger.info(f"Using DATABASE_URL with async driver")

# Convert standard postgresql URL to async URL
async_database_url = database_url._replace(
    drivername="postgresql+asyncpg"
)

# Create async engine with proper SSL configuration for Azure PostgreSQL
engine = create_async_engine(
    async_database_url,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=1800,
    pool_size=5,
    max_overflow=10,
    connect_args={
        "ssl": ssl_context,
        "server_settings": {"jit": "off"}
    }
)

# Create async session factory
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class for models
Base = declarative_base()

async def get_db() -> AsyncSession:
    """Dependency for getting async database sessions"""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except HTTPException:
            # Re-raise HTTP exceptions (business logic errors)
            await session.rollback()
            raise
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """Verify database connectivity"""
    try:
        async with asyncio.timeout(60):  # 60 second timeout for connectivity check
            async with engine.begin() as conn:
                await conn.execute(text("SELECT 1"))
                logger.info("Database connection verified successfully")
    except asyncio.TimeoutError:
        logger.exception("Database connection timed out after 60 seconds")
        raise
    except Exception:
        logger.exception("Database connection failed")
        raise

async def close_db():
    """Close database connections"""
    try:
        await engine.dispose()
        logger.info("Database connections closed successfully")
    except Exception:
        logger.exception("Error closing database connections")
        raise