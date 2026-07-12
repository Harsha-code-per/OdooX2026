#!/usr/bin/env python3
"""Test database connection with different SSL modes"""
import asyncio
import sys

async def test_with_ssl():
    """Test connection with different SSL configurations"""
    try:
        print("Testing database connection with SSL modes...")

        from app.config import get_settings
        settings = get_settings()

        # Parse database URL
        db_url = settings.DATABASE_URL
        print(f"Database URL: {db_url}")

        # Extract connection parameters
        if "@" in db_url:
            creds_part, rest = db_url.split("@", 1)
            if ':' in creds_part.replace("postgresql+asyncpg://", ""):
                # Remove protocol prefix first
                clean_creds = creds_part.replace("postgresql+asyncpg://", "")
                username, password = clean_creds.split(':', 1)
            else:
                username = creds_part.replace("postgresql+asyncpg://", "")
                password = ""

            if "/" in rest:
                host_port, database = rest.split("/", 1)
                if ":" in host_port:
                    host, port = host_port.split(":")
                    port = int(port)
                else:
                    host = host_port
                    port = 5432
            else:
                host = rest
                port = 5432
                database = "postgres"

            print(f"Host: {host}, Port: {port}, Database: {database}, User: {username}")

            # Test different SSL configurations
            ssl_configs = [
                {"ssl": "require"},
                {"ssl": "prefer"},
                {"ssl": "allow"},
                {}  # No SSL
            ]

            import asyncpg

            for ssl_config in ssl_configs:
                try:
                    print(f"\nTrying SSL config: {ssl_config or 'No SSL'}")

                    conn = await asyncio.wait_for(
                        asyncpg.connect(
                            host=host,
                            port=port,
                            user=username,
                            password=password,
                            database=database,
                            **ssl_config
                        ),
                        timeout=8
                    )

                    result = await conn.fetchval('SELECT version()')
                    print(f"✓ Connected successfully!")
                    print(f"  PostgreSQL version: {result[:50]}...")

                    await conn.close()
                    return True

                except asyncio.TimeoutError:
                    print(f"✗ Connection timed out")
                except Exception as e:
                    print(f"✗ Failed: {type(e).__name__}: {str(e)[:100]}")

        return False

    except Exception as e:
        print(f"✗ Test failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_with_ssl())
    sys.exit(0 if success else 1)