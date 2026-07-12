#!/usr/bin/env python3
"""Test the exact database connection used by the application"""

import asyncio
import sys
sys.path.append('/home/yagaven_25/Documents/Projects/OdooX2026/backend')

async def test_application_db_connection():
    """Test the database connection exactly as the application uses it"""

    print("Testing application database connection...")

    try:
        from app.database import init_db
        await init_db()
        print("✅ Application database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Application database connection failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_application_db_connection())
    sys.exit(0 if success else 1)