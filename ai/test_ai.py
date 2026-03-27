# test_ai.py
import asyncio

# Import các service vừa viết
from app.services.prediction_service import prediction_service
from app.services.embedding_vector_service import embedding_service

async def run_tests():
    print("--- BẮT ĐẦU TEST AI SERVICES ---\n")

    # 1. Test Dự đoán Title
    print("1. Đang test predict_chat_title...")
    first_msg = "Bác sĩ ơi, dạo này tôi hay bị đau nhói ở ngực trái lúc thức dậy, kèm theo khó thở nhẹ."
    title = await prediction_service.predict_chat_title(first_msg)
    print(f"-> Câu hỏi: {first_msg}")
    print(f"-> Tiêu đề AI sinh ra: [{title}]\n")

    # 2. Test Dự đoán Topic
    print("2. Đang test predict_chat_topic...")
    chat_history = [
        "Tôi bị nổi nhiều nốt đỏ trên da, rất ngứa",
        "Chào bạn, nốt đỏ xuất hiện bao lâu rồi? Có lan ra không?",
        "Dạ khoảng 3 ngày nay, ban đầu ở tay giờ lan ra lưng rồi ạ.",
        "Bạn có ăn hải sản hay tiếp xúc hóa chất gì lạ không?"
    ]
    specialties = ["Khoa Da Liễu", "Khoa Tiêu Hóa", "Khoa Thần Kinh", "Đa Khoa"]
    topic = await prediction_service.predict_chat_topic(chat_history, specialties)
    print(f"-> AI phân loại vào Khoa: [{topic}]\n")

    # 3. Test Text-to-Vector (Embedding)
    print("3. Đang test embed_user_query...")
    query = "Đau đầu buồn nôn"
    vector = await embedding_service.embed_user_query(query)
    print(f"-> Chiều dài mảng Vector trả về: {len(vector)}")
    print(f"-> 5 chỉ số đầu tiên của Vector: {vector[:5]}\n")

if __name__ == "__main__":
    # Chạy các hàm async
    asyncio.run(run_tests())