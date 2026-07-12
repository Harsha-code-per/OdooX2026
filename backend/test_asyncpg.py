import psycopg

conn = psycopg.connect(
    host="zensphere-db.postgres.database.azure.com",
    port=5432,
    dbname="oodo2026",
    user="neondb_owner",
    password="RANdom-#1234",
    sslmode="require",
)

cur = conn.cursor()
cur.execute("SELECT version();")
print(cur.fetchone())

cur.close()
conn.close()