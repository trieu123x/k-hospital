from fastapi import APIRouter
from app.models.models import DiseaseRequest, DiseaseResponse

router = APIRouter()

@router.post("")
async def disease_to_vector(request: DiseaseRequest) -> DiseaseResponse:
    """
        Thêm logic xử lý để tạo vector của bệnh và lưu nó vào posgres
        Trả về vector để back end lưu vào posgres
    """
    
    vector = []

    return DiseaseResponse(vector=vector)
