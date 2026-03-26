from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.config import settings

from app.api import chat, topic, disease

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/ai/chat", tags=["chat"])
app.include_router(topic.router, prefix="/ai/topic", tags=["topic"])
app.include_router(disease.router, prefix="/ai/disease", tags=["disease"])

@app.get("/")
def root():
    return {"message": "Welcome to MediCare AI Service!"}
