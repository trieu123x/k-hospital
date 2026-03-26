from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    session_id: str
    user_input: str
    
class TopicPredictRequest(BaseModel):
    session_id: str

class DiseaseRequest(BaseModel):
    content: str

