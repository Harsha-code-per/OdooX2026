#!/usr/bin/env python3
"""
Detailed database authentication test to identify the exact issue
"""

import asyncio
import asyncpg

async def test_database_authentication():
    """Test database authentication with detailed logging"""

    print("=" * 70)
    print("DETAILED DATABASE AUTHENTICATION TEST")
    print("=" * 70)

    # Get configuration
    try:
        from app.config import get_settings
        settings = get_settings()

        # Parse URL
        url_str = settings.DATABASE_URL
        if "://" in url_str:
            _, rest = url_str.split("://", 1)
            if "@" in rest:
                auth_part, rest = rest.split("@", 1)
                if ":" in auth_part:
                    username, password = auth_part.split(":", 1)
                if "/" in rest:
                    host_port, database = rest.split("/", 1)
                else:
                    host_port = rest
                    database = "postgres"

                if ":" in host_port:
                    host, port_str = host_port.split(":")
                    port = int(port_str)
                else:
                    host = host_port
                    port = 5432
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return

    print(f"\n🎯 Connection Parameters:")
    print(f"   Host: {host}")
    print(f"   Port: {port}")
    print(f"   Database: {database}")
    print(f"   Username: {username}")
    print(f"   Password: {'*' * len(password)} ({len(password)} chars)")
    print(f"   Password contains special chars: {any(c in password for c in '@:#/&?')}")
    print(f"   Password correctly URL-encoded: {'%23' in url_str if '#' in password else 'N/A'}")

    # Test different connection scenarios
    print("\n" + "=" * 70)
    print("TEST 1: Connection with current parameters")
    print("=" * 70)

    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                database=database,
                ssl='require'
            ),
            timeout=10
        )
        print("✅ Connection successful!")
        result = await conn.fetchval('SELECT version()')
        print(f"✅ PostgreSQL version: {result[:50]}...")
        await conn.close()
        return

    except asyncio.TimeoutError:
        print("❌ Connection timeout - network issue")
    except asyncpg.InvalidPasswordError:
        print("❌ Invalid password - authentication failed")
    except asyncpg.InvalidAuthorizationSpecificationError:
        print("❌ Invalid authorization - user/database mismatch")
    except Exception as e:
        print(f"❌ Connection failed: {type(e).__name__}: {e}")

    # Test 2: Try different SSL modes
    print("\n" + "=" * 70)
    print("TEST 2: Try different SSL modes")
    print("=" * 70)

    ssl_modes = ['require', 'prefer', 'allow']

    for ssl_mode in ssl_modes:
        print(f"\nTesting with SSL mode: {ssl_mode}")
        try:
            conn = await asyncio.wait_for(
                asyncpg.connect(
                    host=host,
                    port=port,
                    user=username,
                    password=password,
                    database=database,
                    ssl=ssl_mode
                ),
                timeout=5
            )
            print(f"✅ Connection successful with SSL: {ssl_mode}")
            await conn.close()
            break
        except Exception as e:
            print(f"❌ Failed with SSL {ssl_mode}: {type(e).__name__}")

    # Test 3: Try connecting to 'postgres' database (default admin database)
    print("\n" + "=" * 70)
    print("TEST 3: Try connecting to 'postgres' database")
    print("=" * 70)

    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                database='postgres',  # Try default database
                ssl='require'
            ),
            timeout=5
        )
        print("✅ Connection successful to 'postgres' database!")
        print("💡 This suggests the database '{}' doesn't exist or no permissions".format(database))

        # Check if our database exists
        databases = await conn.fetch("SELECT datname FROM pg_database WHERE datname = $1", database)
        if databases:
            print(f"✅ Database '{database}' exists")
        else:
            print(f"❌ Database '{database}' does NOT exist in PostgreSQL")
            print(f"💡 You need to create the database first")

        await conn.close()

    except Exception as e:
        print(f"❌ Connection to 'postgres' database failed: {type(e).__name__}")

    # Test 4: Check if it's a password encoding issue
    print("\n" + "=" * 70)
    print("TEST 4: Password encoding check")
    print("=" * 70)

    print(f"Original password in URL: {password[:10]}...")
    print(f"URL contains encoded password: {'%23' in url_str}")

    # Check if we need to URL decode the password
    import urllib.parse
    decoded_password = urllib.parse.unquote(password)
    if decoded_password != password:
        print(f"Password needs decoding: {decoded_password[:10]}...")
        print("Trying with decoded password...")

        try:
            conn = await asyncio.wait_for(
                asyncpg.connect(
                    host=host,
                    port=port,
                    user=username,
                    password=decoded_password,
                    database=database,
                    ssl='require'
                ),
                timeout=5
            )
            print("✅ Connection successful with decoded password!")
            await conn.close()
        except Exception as e:
            print(f"❌ Still failed: {type(e).__name__}")

if __name__ == "__main__":
    asyncio.run(test_database_authentication())