from app.config.ai_model import ai_provider
from app.config.database import db
from google.genai import errors
from app.services.embedding_vector_service import embedding_service
import json

class RAGService:
    def __init__(self):
        pass
    
    @staticmethod
    async def build_and_stream(session_id: str, user_input: str):
        # 1. Lấy 4-5 câu hỏi lịch sử từ DB
        history_query = """
            SELECT role, content 
            FROM chat_messages 
            WHERE session_id = $1 
            ORDER BY created_at DESC 
            LIMIT 5
        """
        history_rows = await db.fetch(history_query, session_id)
        # Sắp xếp lại cho đúng thứ tự thời gian
        history = reversed(history_rows)
        
        history_text = "\n".join([f"{row['role']}: {row['content']}" for row in history])
        combined_text = f"{history_text}\nUSER: {user_input}" if history_text else user_input

        # 2. Biến đổi combined_text thành Vector
        query_vector = await embedding_service.embed_user_query(combined_text)

        # 3. Tra cứu DB lấy bệnh liên quan bằng pgvector
        # Lưu ý: vector <=> $1 là tính Cosine distance (càng nhỏ càng giống)
        disease_query = """
            SELECT name, description, symptoms
            FROM diseases
            ORDER BY embedding <=> $1::vector
            LIMIT 3
        """
        try:
            # Chuyển list vector thành chuỗi [x,y,z...] để pgvector hiểu
            diseases = await db.fetch(disease_query, str(query_vector))
        except Exception as e:
            print(f"[RAG] Lỗi tra cứu bệnh: {e}")
            diseases = []

        # 4. Tra cứu ETL Bác sĩ gợi ý (Top Doctors)
        doctor_query = """
            SELECT reports 
            FROM etl_reports 
            WHERE report_name = 'top_doctors' 
            ORDER BY created_at DESC 
            LIMIT 1
        """
        etl_row = await db.fetchrow(doctor_query)
        top_doctors = etl_row['reports'] if etl_row else None

        # 5. Xây dựng System Prompt kết hợp dữ liệu tra cứu
        diseases_context = ""
        if diseases:
            diseases_context = "Dưới đây là một số thông tin y khoa liên quan có thể tham khảo:\n"
            for d in diseases:
                diseases_context += f"- {d['name']}: {d['description']}. Triệu chứng: {d['symptoms']}\n"

        doctor_context = ""
        # Chiến lược: Chỉ gửi thông tin bác sĩ nếu người dùng hỏi về đặt lịch hoặc cần chuyên gia
        trigger_words = ["bác sĩ", "đặt lịch", "khám", "tư vấn", "chuyên gia", "liên hệ"]
        if top_doctors and any(word in user_input.lower() for word in trigger_words):
            doctor_context = "\nThông tin bác sĩ/lịch khám gợi ý (ETL):\n" + json.dumps(top_doctors, ensure_ascii=False)

        system_prompt = f"""
        Bạn là trợ lý y tế MediCare. Hãy trả lời câu hỏi của bệnh nhân dựa trên ngữ cảnh sau:

        {diseases_context}
        {doctor_context}

        Lịch sử chat:
        {history_text}

        Câu hỏi hiện tại: {user_input}

        Hướng dẫn:
        - Trả lời thân thiện, chuyên nghiệp.
        - Nếu có thông tin bệnh liên quan, hãy tham khảo để trả lời chính xác hơn.
        - Nếu có thông tin bác sĩ, hãy gợi ý cho bệnh nhân nếu phù hợp.
        - Tuyệt đối không tự ý kê đơn thuốc mạnh, hãy khuyên bệnh nhân đi khám nếu tình trạng nặng.
        """
        
        # 6. Gọi Gemini và stream kết quả
        try:
            async for chunk in ai_provider.generate_chat(system_prompt):
                yield chunk 
                
        except errors.APIError as e:
            print(f"Lỗi từ Google API: {e}")
            yield "Xin lỗi, hệ thống AI đang quá tải tạm thời. Bạn vui lòng thử lại sau vài phút nhé!"
            
        except Exception as e:
            print(f"Lỗi hệ thống: {e}")
            yield "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau."

rag_service = RAGService()