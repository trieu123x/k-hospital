import asyncio
import logging
from google import genai
from app.config.config import settings

logger = logging.getLogger(__name__)

class AIProvider:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.fallback_models = [
            'gemini-3.5-flash',
            'gemini-2.5-flash', 
            'gemini-2.0-flash', 
            'gemini-1.5-flash', 
            'gemini-1.5-pro'
        ]

    async def generate_chat(self, prompt: str):
        """
        - Hàm nhận vào prompt hoàn chỉnh để ai xử lý và trả về response
        - Trả về liên tục từng chuỗi ký nhỏ lẻ(gen ra chuỗi nào thì trả về luôn chuỗi đó) 
        thay vì trả 1 lần cho chân thật 
        (Dùng cho chat là hợp lý)
        """
        last_exception = None
        for model in self.fallback_models:
            try:
                response = await self.client.aio.models.generate_content_stream(
                    model=model,
                    contents=prompt
                )
                
                # Try to fetch the first chunk to catch immediate API errors like 503
                iterator = response.__aiter__()
                try:
                    first_chunk = await iterator.__anext__()
                    if first_chunk.text:
                        yield first_chunk.text
                except StopAsyncIteration:
                    return

                # If the first chunk succeeds, stream the rest
                async for texts in iterator:
                    if texts.text:
                        yield texts.text
                
                return # success
            except asyncio.CancelledError:
                print("[CẢNH BÁO] User đã ngắt kết nối. Đã hủy tiến trình tạo chữ của AI!")
                raise
            except Exception as e:
                print(f"[AI MODEL FALLBACK] Model {model} thất bại: {e}")
                last_exception = e
                continue # try next model
        
        raise last_exception or Exception("Tất cả các model đều thất bại hoặc quá tải.")

    async def generate_full_text(self, prompt: str) -> str:
        """
        - Hàm trả về toàn bộ kết quả ngay lập tức phục vụ cho trường hợp cần trả về toàn bộ
        (Ví dụ như generate topic chẳng hạn)
        """
        last_exception = None
        for model in self.fallback_models:
            try:
                response = await self.client.aio.models.generate_content(
                    model=model,
                    contents=prompt
                )
                return response.text            
            except Exception as e:
                print(f"[AI MODEL FALLBACK] Model {model} thất bại: {e}")
                last_exception = e
                continue
        raise last_exception or Exception("Tất cả các model đều thất bại hoặc quá tải.")

    async def generate_text(self, prompt: str) -> str:
        """Sinh ra text phản hồi trong 1 lần"""
        return await self.generate_full_text(prompt)

ai_provider = AIProvider()