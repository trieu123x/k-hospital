from google import genai
from app.config.config import settings
import hashlib
import asyncio
import time
import unicodedata
import re

class EmbeddingService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-embedding-001"
        self.embedding_cache = {}   # {cache_key: (vector, timestamp)}
        self.cache_hits = 0
        self.cache_misses = 0
        self.cache_ttl = 3600       # Cache sống 1 giờ (giây)
        self.cache_max_size = 500   # Tối đa 500 entries
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text để tăng cache hit: lowercase, strip, collapse spaces"""
        text = text.strip().lower()
        # Normalize unicode (ví dụ: dấu tiếng Việt dạng NFC)
        text = unicodedata.normalize("NFC", text)
        # Collapse nhiều khoảng trắng thành 1
        text = re.sub(r"\s+", " ", text)
        return text

    def _get_cache_key(self, text: str) -> str:
        """Tạo cache key từ text đã normalize"""
        normalized = self._normalize_text(text)
        return hashlib.md5(normalized.encode()).hexdigest()
    
    def get_cache_stats(self) -> dict:
        """Lấy thống kê cache"""
        total = self.cache_hits + self.cache_misses
        hit_rate = (self.cache_hits / total * 100) if total > 0 else 0
        return {
            "cache_size": len(self.embedding_cache),
            "hits": self.cache_hits,
            "misses": self.cache_misses,
            "hit_rate": f"{hit_rate:.1f}%"
        }

    def _evict_expired(self):
        """Xóa các cache entries đã hết TTL"""
        now = time.time()
        expired_keys = [k for k, (_, ts) in self.embedding_cache.items() if now - ts > self.cache_ttl]
        for k in expired_keys:
            del self.embedding_cache[k]
        if expired_keys:
            print(f"[EMBEDDING CACHE] Evicted {len(expired_keys)} expired entries")

    def _evict_oldest_if_full(self):
        """Xóa entry cũ nhất nếu cache đầy (LRU-lite)"""
        if len(self.embedding_cache) >= self.cache_max_size:
            oldest_key = min(self.embedding_cache, key=lambda k: self.embedding_cache[k][1])
            del self.embedding_cache[oldest_key]

    async def _get_embedding(self, text: str) -> list[float]:
        # Kiểm tra cache trước (có normalize text)
        cache_key = self._get_cache_key(text)
        now = time.time()
        if cache_key in self.embedding_cache:
            vector, ts = self.embedding_cache[cache_key]
            if now - ts <= self.cache_ttl:  # Còn trong TTL
                self.cache_hits += 1
                stats = self.get_cache_stats()
                print(f"[EMBEDDING CACHE HIT] Sử dụng cached embedding | Stats: {stats}")
                return vector
            else:
                # Expired → xóa
                del self.embedding_cache[cache_key]

        self.cache_misses += 1
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await self.client.aio.models.embed_content(
                    model=self.model_name,
                    contents=text
                )
                embedding_result = response.embeddings[0].values
                # Evict expired + check size trước khi thêm
                self._evict_expired()
                self._evict_oldest_if_full()
                # Lưu vào cache với timestamp
                self.embedding_cache[cache_key] = (embedding_result, time.time())
                stats = self.get_cache_stats()
                print(f"[EMBEDDING MISS] API called | Stats: {stats}")
                return embedding_result
            except Exception as e:
                print(f"[EMBEDDING ERROR] Gemini API error: {str(e)[:50]}")
                if "429" in str(e) or "quota" in str(e).lower() or attempt < max_retries - 1:
                    retry_delay = 1 if attempt < max_retries - 1 else 2
                    print(f"Retrying after {retry_delay} seconds...")
                    await asyncio.sleep(retry_delay)
                else:
                    raise e
        return [0.0] * 3072

    # Vector data bệnh (có áp dụng chunking)
    async def embed_disease_data(self, disease_name: str, description: str, symptoms: str) -> list[dict]:
        from app.services.chunking_service import chunking_service
        full_text = f"Bệnh: {disease_name}. Mô tả: {description}. Triệu chứng: {symptoms}"
        chunks = chunking_service.split_text(full_text)
        
        results = []
        for i, chunk in enumerate(chunks):
            vector = await self._get_embedding(chunk)
            results.append({
                "chunk_index": i,
                "content": chunk,
                "vector": vector
            })
        return results

    # Vector data thuốc (có áp dụng chunking)
    async def embed_medicine_data(self, name: str, ingredients: str, usage: str, side_effects: str) -> list[dict]:
        from app.services.chunking_service import chunking_service
        full_text = f"Thuốc: {name}. Thành phần: {ingredients}. Hướng dẫn: {usage}. Tác dụng phụ: {side_effects}"
        chunks = chunking_service.split_text(full_text)
        
        results = []
        for i, chunk in enumerate(chunks):
            vector = await self._get_embedding(chunk)
            results.append({
                "chunk_index": i,
                "content": chunk,
                "vector": vector
            })
        return results

    # Vector data bác sĩ (có áp dụng chunking)
    async def embed_doctor_data(self, name: str, specialty: str, experience: str, education: str) -> list[dict]:
        from app.services.chunking_service import chunking_service
        full_text = f"Bác sĩ: {name}. Chuyên khoa: {specialty}. Kinh nghiệm: {experience}. Học vấn: {education}"
        chunks = chunking_service.split_text(full_text)
        
        results = []
        for i, chunk in enumerate(chunks):
            vector = await self._get_embedding(chunk)
            results.append({
                "chunk_index": i,
                "content": chunk,
                "vector": vector
            })
        return results

    # Vector data của đoạn chat
    async def embed_user_query(self, user_message_content: str) -> list[float]:
        return await self._get_embedding(user_message_content)

embedding_service = EmbeddingService()