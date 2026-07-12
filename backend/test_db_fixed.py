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

        # Parse connection string manually to handle special characters in password
        # Format: postgresql+asyncpg://user:password@host:port/database
        db_url = settings.DATABASE_URL

        if "postgresql+asyncpg://" in db_url:
            # Extract components
            rest = db_url.replace("postgresql+asyncpg://", "")
            creds_part, rest = rest.split('@')

            if ':' in creds_part:
                username, password = creds_part.split(':', 1)
            else:
                username = creds_part
                password = ''

            # Extract host, port, database
            if '/' in rest:
                host_port, database = rest.split('/', 1)
            else:
                host_port = rest
                database = 'postgres'

            if ':' in host_port:
                host, port = host_port.split(':')
                port = int(port)
            else:
                host = host_port
                port = 5432

            print(f"Connecting to: {host}:{port}/{database} as {username}")

            # Use asyncpg.connect with parameters
            conn = await asyncio.wait_for(
                asyncpg.connect(
                    host=host,
                    port=port,
                    user=username,
                    password=password,
                    database=database
                ),
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