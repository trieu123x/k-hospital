from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('keepitreal/vietnamese-sbert')

    # Vector data bệnh (có áp dụng chunking)
    async def embed_disease_data(self, disease_name: str, description: str, symptoms: str) -> list[dict]:
        from app.services.chunking_service import chunking_service
        full_text = f"Bệnh: {disease_name}. Mô tả: {description}. Triệu chứng: {symptoms}"
        chunks = chunking_service.split_text(full_text)
        
        results = []
        for i, chunk in enumerate(chunks):
            vector = self.model.encode(chunk)
            results.append({
                "chunk_index": i,
                "content": chunk,
                "vector": vector.tolist()
            })
        return results

    # Vector data thuốc (có áp dụng chunking)
    async def embed_medicine_data(self, name: str, ingredients: str, usage: str, side_effects: str) -> list[dict]:
        from app.services.chunking_service import chunking_service
        full_text = f"Thuốc: {name}. Thành phần: {ingredients}. Hướng dẫn: {usage}. Tác dụng phụ: {side_effects}"
        chunks = chunking_service.split_text(full_text)
        
        results = []
        for i, chunk in enumerate(chunks):
            vector = self.model.encode(chunk)
            results.append({
                "chunk_index": i,
                "content": chunk,
                "vector": vector.tolist()
            })
        return results

    # Vector data bác sĩ (có áp dụng chunking)
    async def embed_doctor_data(self, name: str, specialty: str, experience: str, education: str) -> list[dict]:
        from app.services.chunking_service import chunking_service
        full_text = f"Bác sĩ: {name}. Chuyên khoa: {specialty}. Kinh nghiệm: {experience}. Học vấn: {education}"
        chunks = chunking_service.split_text(full_text)
        
        results = []
        for i, chunk in enumerate(chunks):
            vector = self.model.encode(chunk)
            results.append({
                "chunk_index": i,
                "content": chunk,
                "vector": vector.tolist()
            })
        return results

    # Vector data của đoạn chat
    async def embed_user_query(self, user_message_content: str) -> list[float]:
        vector = self.model.encode(user_message_content)
        return vector.tolist()

embedding_service = EmbeddingService()