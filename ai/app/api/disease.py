from fastapi import APIRouter
from app.models.models import DiseaseRequest

router = APIRouter()

@router.post("/disease")
async def disease_to_vector(request: DiseaseRequest):
    """
        Thêm logic xử lý để tạo vector của bệnh và lưu nó vào posgres
        Có thể trả về gì đó ở đây để thông báo cho back end
    """
    
    return 
