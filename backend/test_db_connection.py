#!/usr/bin/env python3
import asyncio
import sys
import traceback

async def test_db_connection():
    try:
        from app.database import engine
        from app.config import get_settings

        settings = get_settings()
        print(f"Database URL: {settings.DATABASE_URL}")

        # Test basic connection
        print("Testing database connection...")
        async with engine.begin() as conn:
            result = await conn.execute("SELECT 1")
            print(f"Database connection successful: {result}")

        # Test metadata creation
        print("\nTesting metadata creation...")
        from app.database import Base
        import app.models  # Import all models

        print(f"Models imported: {Base.metadata.tables.keys()}")

        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            print("Database tables created/verified successfully")

    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        traceback.print_exc()
        return False

    return True

if __name__ == "__main__":
    success = asyncio.run(test_db_connection())
    sys.exit(0 if success else 1)