import re
import math
from app.config.ai_model import ai_provider
from app.config.database import db
from app.services.embedding_vector_service import embedding_service

class PredictionService:
    async def predict_chat_title(self, first_message_content: str) -> str:
        prompt = (
            "Bạn là trợ lý y tế. Hãy đọc tin nhắn sau của bệnh nhân và tóm tắt thành một tiêu đề siêu ngắn gọn "
            "(tối đa 6 từ). Chỉ trả về tiêu đề, không giải thích, không dùng dấu ngoặc kép.\n\n"
            f"Tin nhắn: '{first_message_content}'"
        )
        
        try:
            title = await ai_provider.generate_text(prompt)
            return title.strip().strip('"').strip("'")
            
        except Exception as e:
            print(f"[CẢNH BÁO] Không gọi được AI tạo Title (Lỗi: {e}). Chuyển sang cắt chuỗi thủ công.")
            words = first_message_content.split()
            if len(words) <= 6:
                return first_message_content
            return " ".join(words[:6]) + "..."

    def _cosine_similarity(self, v1: list[float], v2: list[float]) -> float:
        dot_product = sum(a * b for a, b in zip(v1, v2))
        norm_v1 = math.sqrt(sum(a * a for a in v1))
        norm_v2 = math.sqrt(sum(b * b for b in v2))
        if norm_v1 == 0 or norm_v2 == 0: 
            return 0.0
        return dot_product / (norm_v1 * norm_v2)

    async def predict_chat_topic(self, chat_history_contents: list[str]) -> dict:
        query = "SELECT id, name, description FROM specialties"
        try:
            db_specialties_rows = await db.fetch(query)
            db_specialties = [dict(row) for row in db_specialties_rows]
        except Exception as e:
            print(f"[PREDICTION] Lỗi truy vấn specialties: {e}")
            return {"id": None, "name": "Nội tổng quát"}
            
        if not db_specialties:
            return {"id": None, "name": "Nội tổng quát"}

        # 2. Biến toàn bộ lịch sử chat thành 1 Vector
        full_chat_text = " ".join(chat_history_contents)
        chat_vector = await embedding_service.embed_user_query(full_chat_text)

        best_spec = db_specialties[0]
        max_score = -1.0

        # 3. So sánh Vector Chat với Vector của từng Khoa (dựa vào Tên + Mô tả)
        for spec in db_specialties:
            spec_text = f"{spec['name']}: {spec['description']}"
            
            spec_vector = await embedding_service.embed_user_query(spec_text)
            
            score = self._cosine_similarity(chat_vector, spec_vector)
            
            if score > max_score:
                max_score = score
                best_spec = spec

        if max_score < 0.1:
            default_spec = next((s for s in db_specialties if s['name'] == 'Nội tổng quát'), db_specialties[0])
            return default_spec

        return best_spec
    async def process_and_update_title(self, session_id: str) -> str:
        try:
            query_first_msg = "SELECT content FROM chat_messages WHERE session_id = $1 AND role = 'USER' ORDER BY created_at ASC LIMIT 1"
            first_msg_row = await db.fetchrow(query_first_msg, session_id)
            
            if not first_msg_row:
                return "Cuộc trò chuyện mới"
                
            generated_title = await self.predict_chat_title(first_msg_row['content'])

            await db.execute("UPDATE chat_sessions SET title = $1 WHERE id = $2", generated_title, session_id)
            
            return generated_title
        except Exception as e:
            print(f"[SERVICE LỖI] process_and_update_title: {e}")
            return "Cuộc trò chuyện mới"

    async def process_and_update_topic(self, session_id: str) -> dict:
        try:
            messages = await db.fetch("SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC", session_id)
            if not messages:
                return {"status": "error", "message": "Không có lịch sử chat"}

            chat_history = [f"{msg['role']}: {msg['content']}" for msg in messages]

            topic_result = await self.predict_chat_topic(chat_history)
            
            topic_name = topic_result.get('name')

            if topic_name:
                await db.execute("UPDATE chat_sessions SET topic = $1 WHERE id = $2", topic_name, session_id)

            return {
                "status": "success", 
                "data": {"session_id": session_id, "topic_name": topic_name}
            }
        except Exception as e:
            print(f"[SERVICE LỖI] process_and_update_topic: {e}")
            return {"status": "error", "message": str(e)}

prediction_service = PredictionService()