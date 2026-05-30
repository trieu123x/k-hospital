from google import genai
from app.config.config import settings

class EmbeddingService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-embedding-001"

    async def _get_embedding(self, text: str) -> list[float]:
        import asyncio
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await self.client.aio.models.embed_content(
                    model=self.model_name,
                    contents=text
                )
                return response.embeddings[0].values
            except Exception as e:
                print(f"[EMBEDDING ERROR] Gemini API error: {str(e)[:50]}")
                if "429" in str(e) or "quota" in str(e).lower() or attempt < max_retries - 1:
                    print("Retrying after 5 seconds...")
                    await asyncio.sleep(5)
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