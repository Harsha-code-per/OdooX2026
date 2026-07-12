import asyncio
import asyncpg
import ssl

async def main():
    conn = await asyncpg.connect(
        host="40.80.81.186",        # <-- Force IPv4
        port=5432,
        user="neondb_owner",
        password="YOUR_PASSWORD",
        database="oodo2026",
        ssl=ssl.create_default_context(),
        timeout=60,
    )

    print(await conn.fetchval("SELECT version();"))
    await conn.close()

asyncio.run(main())