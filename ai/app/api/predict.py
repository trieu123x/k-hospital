from fastapi import APIRouter
from app.models.models import TopicPredictRequest, TitlePredictRequest, TitlePredictResponse
from app.services.prediction_service import prediction_service

router = APIRouter()

@router.post("/topic")
async def predict_topic(request: TopicPredictRequest):
    result = await prediction_service.process_and_update_topic(request.session_id)
    return result

@router.post("/title")
async def predict_title(request: TitlePredictRequest) -> TitlePredictResponse:
    print("START!")
    generated_title = await prediction_service.predict_chat_title(request.first_message)
    print("END!")
    return TitlePredictResponse(title=generated_title)