from app.config.ai_model import ai_provider

class RAGService:
    def __init__(self):
        pass
    
    async def build_and_stream(self, session_id: str, user_input: str):
        # ---------------------------------------------------------
        # [PHẦN CỦA TRIỀU]: LÀM VIỆC VỚI VECTOR VÀ DATABASE
        # ---------------------------------------------------------
        
        # 1. Triều: Lấy 4-5 câu hỏi lịch sử từ DB (gọi db.fetch(...))
        # TODO: Coder Triều làm
        
        # 2. Triều: Nhờ Tùng biến đổi user_input thành Vector
        # TODO: Coder Triều làm
        
        # 3. Triều: Tra cứu DB lấy bệnh liên quan bằng pgvector (gọi db.fetch(...))
        # TODO: Coder Triều làm
        
        # 4. Triều: Tra cứu ETL Bác sĩ (gọi db.fetch(...))
        # TODO: Coder Triều làm
        
        # 5. Triều: Gộp tất cả dữ liệu trên lại thành 1 chuỗi System Prompt khổng lồ
        # (Tạm thời gán bằng user_input để Dũng có thể test luồng Stream luôn)
        final_prompt = f"" 
        
        # Gọi hàm của ai_provider và yield từng chữ để StreamingResponse tiêu thụ
        async for chunk in ai_provider.generate_chat(final_prompt):
            yield chunk

rag_service = RAGService()