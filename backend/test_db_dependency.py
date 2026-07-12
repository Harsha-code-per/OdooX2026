#!/usr/bin/env python3
"""Test database dependency function"""
import asyncio
import sys
sys.path.append('/home/yagaven_25/Documents/Projects/OdooX2026/backend')

async def test_get_db():
    """Test the get_db dependency function"""
    try:
        from app.database import get_db, async_session_factory

        print("Testing database session factory...")

        # Test session creation
        async with async_session_factory() as session:
            from sqlalchemy import text
            result = await session.execute(text("SELECT 1"))
            print(f"✅ Session factory works: {result.scalar()}")

        print("Testing get_db dependency...")
        db_gen = get_db()
        session = await db_gen.__anext__()
        print(f"✅ get_db works: {session}")

        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_get_db())
    sys.exit(0 if success else 1)