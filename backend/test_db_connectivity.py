#!/usr/bin/env python3
"""Test database connectivity and suggest fixes"""
import asyncio
import socket
import sys

async def test_network_connectivity():
    """Test if we can reach the database server"""
    try:
        # Extract host and port from database URL
        from app.config import get_settings
        settings = get_settings()

        db_url = settings.DATABASE_URL
        print(f"Database URL: {db_url}")

        # Parse host and port
        if "@" in db_url:
            _, host_port_db = db_url.split("@", 1)
            if "/" in host_port_db:
                host_port, _ = host_port_db.split("/", 1)
                if ":" in host_port:
                    host, port_str = host_port.split(":")
                    port = int(port_str.split('/')[0] if '/' in port_str else port_str)
                else:
                    host = host_port
                    port = 5432

                print(f"Testing connectivity to {host}:{port}...")

                # Test TCP connection
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(5)
                result = sock.connect_ex((host, port))
                sock.close()

                if result == 0:
                    print(f"✓ Successfully connected to {host}:{port}")
                    return True
                else:
                    print(f"✗ Cannot connect to {host}:{port} (error code: {result})")
                    return False
            else:
                print("✗ Cannot parse database URL format")
                return False
        else:
            print("✗ Invalid database URL format")
            return False

    except Exception as e:
        print(f"✗ Network test failed: {type(e).__name__}: {e}")
        return False

async def main():
    print("=== Database Connectivity Test ===\n")

    network_ok = await test_network_connectivity()

    print("\n=== Diagnosis ===")
    if network_ok:
        print("✓ Network connectivity to database server is working")
        print("  The issue might be:")
        print("  - Incorrect database credentials")
        print("  - Database name doesn't exist")
        print("  - Firewall rules blocking PostgreSQL protocol")
        print("  - SSL/TLS handshake issues")
    else:
        print("✗ Cannot reach database server")
        print("  Possible causes:")
        print("  - Database server is down")
        print("  - Network connectivity issues")
        print("  - Firewall blocking the connection")
        print("  - Incorrect host/port in DATABASE_URL")

    print("\n=== Solutions ===")
    print("1. Check if database server is running and accessible")
    print("2. Verify DATABASE_URL environment variable is correct")
    print("3. Test with a local PostgreSQL instance if available")
    print("4. Contact your database administrator or cloud provider")
    print("5. Try connecting with psql or pgAdmin to verify credentials")

if __name__ == "__main__":
    asyncio.run(main())