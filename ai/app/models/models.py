from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    session_id: str
    user_input: str
    
class TopicPredictRequest(BaseModel):
    session_id: str

class TitlePredictRequest(BaseModel):
    session_id: str

class TitlePredictResponse(BaseModel):
    title: str

class DiseaseRequest(BaseModel):
    content: str

class DiseaseResponse(BaseModel):
    vector: List[float]

