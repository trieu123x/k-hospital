from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.models import ChatRequest
from app.services.rag import RAGService

router = APIRouter()

@router.post("")
async def chat(request: ChatRequest):
    """
    Thực thi logic của chat, nhận vào session_id và prompt, trả về response
    """

    stream = RAGService.build_and_stream(
        session_id=request.session_id,
        user_input=request.user_input
    )
    
    return StreamingResponse(stream, media_type="text/event-stream")
