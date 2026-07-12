#!/usr/bin/env python3
"""Database connection diagnostic script"""
import asyncio
import ssl
from urllib.parse import urlparse
from app.config import get_settings

async def test_basic_connection():
    """Test basic TCP connectivity"""
    settings = get_settings()

    # Parse the connection URL - handle special characters properly
    try:
        # Manually parse since urlparse doesn't handle special chars well
        url_str = settings.DATABASE_URL
        if "://" not in url_str:
            print("❌ Invalid URL format - missing protocol")
            return False

        protocol, rest = url_str.split("://", 1)
        if "@" not in rest:
            print("❌ Invalid URL format - missing @ separator")
            return False

        auth_part, rest = rest.split("@", 1)
        if ":" in auth_part:
            username, password = auth_part.split(":", 1)
        else:
            username = auth_part
            password = ""

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

        print(f"🔍 Testing connection to: {host}:{port}")
        print(f"🔍 Database: {database}")
        print(f"🔍 User: {username}")
        print(f"🔍 Password contains special chars: {any(c in password for c in '#@:&')}")

    except Exception as e:
        print(f"❌ URL parsing failed: {e}")
        return False

    # Test basic TCP connection
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=10
        )
        print("✅ Basic TCP connection successful")
        writer.close()
        await writer.wait_closed()
    except Exception as e:
        print(f"❌ Basic TCP connection failed: {e}")
        return False

    # Test SSL connection
    try:
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port, ssl=ssl_context),
            timeout=10
        )
        print("✅ SSL connection successful")
        writer.close()
        await writer.wait_closed()
    except Exception as e:
        print(f"❌ SSL connection failed: {e}")
        return False

    return True

async def test_asyncpg_connection():
    """Test asyncpg connection"""
    try:
        import asyncpg
        settings = get_settings()

        # Parse the URL manually to handle special characters
        url_str = settings.DATABASE_URL
        if "://" not in url_str:
            return False

        protocol, rest = url_str.split("://", 1)
        if "@" not in rest:
            return False

        auth_part, rest = rest.split("@", 1)
        if ":" in auth_part:
            username, password = auth_part.split(":", 1)
        else:
            username = auth_part
            password = ""

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

        print("🔍 Testing asyncpg connection...")

        conn = await asyncio.wait_for(
            asyncpg.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                database=database,
                ssl='require'
            ),
            timeout=15
        )

        result = await conn.fetchval('SELECT 1')
        print(f"✅ asyncpg connection successful, query result: {result}")

        await conn.close()
        return True

    except Exception as e:
        print(f"❌ asyncpg connection failed: {e}")
        return False

async def main():
    print("🚀 Starting database connection diagnostics...\n")

    # Test basic connectivity
    basic_ok = await test_basic_connection()

    if not basic_ok:
        print("\n❌ Basic connectivity failed - check network/firewall")
        return

    # Test asyncpg connection
    asyncpg_ok = await test_asyncpg_connection()

    if asyncpg_ok:
        print("\n✅ All connection tests passed!")
    else:
        print("\n❌ asyncpg connection failed - check credentials/SSL settings")

if __name__ == "__main__":
    asyncio.run(main())