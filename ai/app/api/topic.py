from fastapi import APIRouter
from app.models.models import TopicPredictRequest

router = APIRouter()

@router.post("/predict")
async def predict_topic(request: TopicPredictRequest):
    """
        Thêm logic xử lý để cập nhật topic cho phiên chat với session_id từ nội dung chat trong bảng chat_messages
        Có thể trả về gì đó ở đây để thông báo cho back end
    """
    
    return 
