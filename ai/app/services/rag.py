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

        # 3. Tra cứu DB lấy chunk liên quan (Bệnh, Thuốc, Bác sĩ)
        disease_query = """
            SELECT d.name, d.description, dc.content as symptoms
            FROM disease_chunks dc
            JOIN diseases d ON dc.disease_id = d.id
            ORDER BY dc.embedding <=> $1::vector
            LIMIT 3
        """
        
        medicine_query = """
            SELECT m.name, mc.content
            FROM medicine_chunks mc
            JOIN medicines m ON mc.medicine_id = m.id
            ORDER BY mc.embedding <=> $1::vector
            LIMIT 3
        """

        doctor_chunks_query = """
            SELECT p.full_name as name, s.name as specialty, doc_c.content
            FROM doctor_chunks doc_c
            JOIN doctors d ON doc_c.doctor_id = d.id
            JOIN profiles p ON d.id = p.id
            LEFT JOIN specialties s ON d.specialty_id = s.id
            ORDER BY doc_c.embedding <=> $1::vector
            LIMIT 2
        """

        try:
            vector_str = str(query_vector)
            diseases = await db.fetch(disease_query, vector_str)
            medicines = await db.fetch(medicine_query, vector_str)
            doctor_chunks = await db.fetch(doctor_chunks_query, vector_str)
        except Exception as e:
            print(f"[RAG] Lỗi tra cứu vector: {e}")
            diseases, medicines, doctor_chunks = [], [], []

        # 4. Tra cứu ETL Bác sĩ gợi ý (Dành cho thông tin tổng quát/top)
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

        medicines_context = ""
        if medicines:
            medicines_context = "\nThông tin thuốc liên quan:\n"
            for m in medicines:
                medicines_context += f"- {m['name']}: {m['content']}\n"

        doctor_context = ""
        # 1. Thông tin bác sĩ từ chunks (kinh nghiệm, học vấn)
        if doctor_chunks:
            doctor_context = "\nThông tin chi tiết về bác sĩ phù hợp:\n"
            for doc in doctor_chunks:
                doctor_context += f"- Bác sĩ {doc['name']} ({doc['specialty']}): {doc['content']}\n"

        # 2. Gợi ý từ Top Doctors (ETL)
        trigger_words = ["bác sĩ", "đặt lịch", "khám", "tư vấn", "chuyên gia", "liên hệ", "ai", "ai tốt"]
        if top_doctors and any(word in user_input.lower() for word in trigger_words):
            doctor_context += "\nDanh sách bác sĩ gợi ý nổi bật:\n" + json.dumps(top_doctors, ensure_ascii=False)

        system_prompt = f"""
        Bạn là trợ lý y tế MediCare. Hãy trả lời câu hỏi của bệnh nhân dựa trên ngữ cảnh y khoa sau:

        {diseases_context}
        {medicines_context}
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
        
        try:
            async for text in ai_provider.generate_chat(system_prompt):
                yield f"data: {text}\n\n" 
                
        except errors.APIError as e:
            print(f"Lỗi hệ thống: {e}")
            yield f"data: Xin lỗi, hệ thống AI đang quá tải...\n\n"
            
        except Exception as e:
            print(f"Lỗi hệ thống: {e}")
            yield f"data: Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.\n\n"

rag_service = RAGService()