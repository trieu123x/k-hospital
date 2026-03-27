import asyncpg
from app.config.config import settings

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        if not self.pool:
            self.pool = await asyncpg.create_pool(dsn=settings.DATABASE_URL)
            print("[DB] Connection pool created")

    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            print("[DB] Connection pool closed")

    async def fetch(self, query: str, *args):
        if not self.pool:
            await self.connect()
        async with self.pool.acquire() as connection:
            return await connection.fetch(query, *args)

    async def fetchrow(self, query: str, *args):
        if not self.pool:
            await self.connect()
        async with self.pool.acquire() as connection:
            return await connection.fetchrow(query, *args)

    async def execute(self, query: str, *args):
        if not self.pool:
            await self.connect()
        async with self.pool.acquire() as connection:
            return await connection.execute(query, *args)

db = Database()
