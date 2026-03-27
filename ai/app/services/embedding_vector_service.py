from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self):
        # Tải mô hình tiếng Việt siêu nhẹ về máy (lần đầu chạy sẽ hơi lâu để tải khoảng 400MB)
        # Những lần sau server chạy sẽ load thẳng từ ổ cứng lên, cực kỳ nhanh.
        self.model = SentenceTransformer('keepitreal/vietnamese-sbert')

    async def embed_disease_data(self, disease_name: str, description: str, symptoms: str) -> list[float]:
        text_to_embed = f"Bệnh: {disease_name}. Mô tả: {description}. Triệu chứng: {symptoms}"
        # Biến text thành mảng vector numpy, sau đó ép về list chuẩn của Python
        vector = self.model.encode(text_to_embed)
        return vector.tolist()

    async def embed_user_query(self, user_message_content: str) -> list[float]:
        vector = self.model.encode(user_message_content)
        return vector.tolist()

embedding_service = EmbeddingService()