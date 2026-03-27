import re
# Import ai_provider để gọi Gemini
from app.config.ai_model import ai_provider

class PredictionService:
    def __init__(self):
        # Bộ từ khóa nội bộ (Bạn có thể mở rộng danh sách này sau)
        self.keyword_rules = {
            "Khoa Da Liễu": ["ngứa", "nổi mẩn", "mụn", "dị ứng", "ban đỏ", "lang ben"],
            "Khoa Tiêu Hóa": ["đau bụng", "tiêu chảy", "buồn nôn", "đầy hơi", "khó tiêu", "dạ dày"],
            "Khoa Thần Kinh": ["đau đầu", "chóng mặt", "mất ngủ", "co giật", "tê bì"],
            "Khoa Hô Hấp": ["Ho", "khó thở", "sổ mũi", "viêm họng", "đờm"]
        }

    async def predict_chat_title(self, first_message_content: str) -> str:
        """Sử dụng AI để tóm tắt tin nhắn đầu tiên thành tiêu đề. Có fallback chống lỗi Rate Limit."""
        prompt = (
            "Bạn là trợ lý y tế. Hãy đọc tin nhắn sau của bệnh nhân và tóm tắt thành một tiêu đề siêu ngắn gọn "
            "(tối đa 6 từ). Chỉ trả về tiêu đề, không giải thích, không dùng dấu ngoặc kép.\n\n"
            f"Tin nhắn: '{first_message_content}'"
        )
        
        try:
            # Gọi API Gemini
            title = await ai_provider.generate_text(prompt)
            # Dọn dẹp kết quả (xóa khoảng trắng thừa hoặc dấu ngoặc kép nếu AI lỡ sinh ra)
            return title.strip().strip('"').strip("'")
            
        except Exception as e:
            # FALLBACK: Nếu API lỗi (quá hạn mức, rớt mạng...), tự động dùng thuật toán cắt chuỗi cũ
            print(f"[CẢNH BÁO] Không gọi được AI tạo Title (Lỗi: {e}). Chuyển sang cắt chuỗi thủ công.")
            words = first_message_content.split()
            if len(words) <= 6:
                return first_message_content
            return " ".join(words[:6]) + "..."

    async def predict_chat_topic(self, chat_history_contents: list[str], specialties_list: list[str]) -> str:
        """Thuật toán: Quét từ khóa, khoa nào xuất hiện nhiều từ khóa nhất thì chọn"""
        full_text = " ".join(chat_history_contents).lower()
        
        # Khởi tạo bảng điểm cho các khoa đang có trong DB
        scores = {specialty: 0 for specialty in specialties_list}
        
        # Chấm điểm dựa trên từ khóa
        for specialty, keywords in self.keyword_rules.items():
            if specialty in scores: 
                for kw in keywords:
                    scores[specialty] += len(re.findall(rf"\b{kw}\b", full_text))
        
        # Lấy khoa có điểm cao nhất
        best_match = max(scores, key=scores.get)
        
        # Nếu đoạn chat không chứa từ khóa nào, gán nhãn an toàn
        if scores[best_match] == 0:
            return "Đa Khoa"
            
        return best_match

prediction_service = PredictionService()