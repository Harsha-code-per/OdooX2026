import asyncio
import asyncpg

async def main():
    conn = await asyncpg.connect(
        host="zensphere-db.postgres.database.azure.com",
        port=5432,
        user="neondb_owner",
        password="YOUR_PASSWORD",
        database="oodo2026",
        ssl="require",
    )
    print("Connected successfully!")
    await conn.close()

asyncio.run(main())