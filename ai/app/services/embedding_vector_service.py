from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('keepitreal/vietnamese-sbert')

    # Vector data bệnh
    async def embed_disease_data(self, disease_name: str, description: str, symptoms: str) -> list[float]:
        text_to_embed = f"Bệnh: {disease_name}. Mô tả: {description}. Triệu chứng: {symptoms}"
        vector = self.model.encode(text_to_embed)
        return vector.tolist()

    # Vector data của đoạn chat
    async def embed_user_query(self, user_message_content: str) -> list[float]:
        vector = self.model.encode(user_message_content)
        return vector.tolist()

embedding_service = EmbeddingService()