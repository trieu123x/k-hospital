import asyncpg
from app.config.config import settings

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        """Khởi tạo kết nối tới supabase postgres"""
        if self.pool is None:
            self.pool = await asyncpg.create_pool(
                settings.DATABASE_URL,
                min_size=1,   # Giữ ít nhất 1 kết nối mở
                max_size=10   # Tối đa 10 kết nối đồng thời
            )

    async def close(self):
        """Đóng toàn bộ kết nối khi tắt server"""
        if self.pool is not None:
            await self.pool.close()

    async def fetch(self, query: str, *args):
        """
        Dùng cho các lệnh SELECT. 
        """
        await self.connect()
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(query, *args)
            return [dict(row) for row in rows]

    async def execute(self, query: str, *args):
        """
        Dùng cho các lệnh INSERT, UPDATE, DELETE.
        """
        await self.connect()
        async with self.pool.acquire() as conn:
            return await conn.execute(query, *args)

db = Database()