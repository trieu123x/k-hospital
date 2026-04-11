import asyncio
from google import genai
from app.config.config import settings

class AIProvider:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = 'gemini-2.5-flash-lite'

    async def generate_chat(self, prompt: str):
        """
        - Hàm nhận vào prompt hoàn chỉnh để ai xử lý và trả về response
        - Trả về liên tục từng chuỗi ký nhỏ lẻ(gen ra chuỗi nào thì trả về luôn chuỗi đó) 
        thay vì trả 1 lần cho chân thật 
        (Dùng cho chat là hợp lý)
        """
        try:
            response = await self.client.aio.models.generate_content_stream(
                model=self.model_name,
                contents=prompt
            )
            
            async for texts in response:
                if texts.text:
                    yield texts.text
                    
        except asyncio.CancelledError:
            print("[CẢNH BÁO] User đã ngắt kết nối. Đã hủy tiến trình tạo chữ của AI!")
            raise

    async def generate_full_text(self, prompt: str) -> str:
        """
        - Hàm trả về toàn bộ kết quả ngay lập tức phục vụ cho trường hợp cần trả về toàn bộ
        (Ví dụ như generate topic chẳng hạn)
        """
        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        
        return response.text            
    async def generate_text(self, prompt: str) -> str:
        """Sinh ra text phản hồi trong 1 lần"""
        return await self.generate_full_text(prompt)

ai_provider = AIProvider()