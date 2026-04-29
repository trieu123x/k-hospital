import re

class ChunkingService:
    def __init__(self, chunk_size: int = 600, chunk_overlap: int = 100):
        """
        Khởi tạo dịch vụ chunking.
        :param chunk_size: Số lượng ký tự tối đa trong một chunk.
        :param chunk_overlap: Số lượng ký tự chồng lấp giữa các chunk.
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> list[str]:
        """
        Chia nhỏ văn bản thành các đoạn (chunks) dựa trên số lượng ký tự và chồng lấp.
        Cố gắng không cắt ngang giữa các câu nếu có thể.
        """
        if not text:
            return []

        # Tách theo câu trước (dùng regex đơn giản)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        chunks = []
        current_chunk = ""

        for sentence in sentences:
            # Nếu thêm câu này vào chunk hiện tại mà vượt quá giới hạn
            if len(current_chunk) + len(sentence) > self.chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                # Bắt đầu chunk mới với một phần chồng lấp từ chunk cũ
                # (Đơn giản hóa: lấy N ký tự cuối của chunk cũ)
                overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else current_chunk
                current_chunk = overlap_text + " " + sentence
            else:
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks

chunking_service = ChunkingService()
