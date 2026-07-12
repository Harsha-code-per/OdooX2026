#!/usr/bin/env python3
import asyncio
import sys

async def test_basic_connection():
    try:
        print("Testing asyncpg connection...")
        import asyncpg
        from app.config import get_settings

        settings = get_settings()
        print(f"Database URL: {settings.DATABASE_URL}")

        # Parse connection string
        # Format: postgresql+asyncpg://user:password@host:port/database
        db_url = settings.DATABASE_URL
        conn_str = db_url.replace("postgresql+asyncpg://", "postgresql://")

        print(f"Attempting connection to: {conn_str.split('@')[1] if '@' in conn_str else 'unknown'}")

        conn = await asyncio.wait_for(
            asyncpg.connect(conn_str),
            timeout=5.0
        )

        result = await conn.fetchval('SELECT 1')
        print(f"Connection successful! Result: {result}")

        await conn.close()
        return True

    except asyncio.TimeoutError:
        print("Connection timed out after 5 seconds")
        return False
    except Exception as e:
        print(f"Connection failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_basic_connection())
    sys.exit(0 if success else 1)