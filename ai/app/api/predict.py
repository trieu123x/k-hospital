from fastapi import APIRouter
from app.models.models import TopicPredictRequest, TitlePredictRequest, TitlePredictResponse

router = APIRouter()

@router.post("/topic")
async def predict_topic(request: TopicPredictRequest):
    """
        Thêm logic xử lý để cập nhật topic cho phiên chat với session_id từ nội dung chat trong bảng chat_messages
        Có thể trả về gì đó ở đây để thông báo cho back end
    """
    
    return 

@router.post("/title")
async def predict_title(request: TitlePredictRequest) -> TitlePredictResponse:
    """
        Thêm logic xử lý để cập nhật topic cho phiên chat với session_id từ nội dung chat trong bảng chat_messages
        Có thể trả về gì đó ở đây để thông báo cho back end
    """
    
    return TitlePredictResponse(title="")
