from fastapi import FastAPI
from pydantic import BaseModel
from app.llm_client import get_recommendation
from app.schema import LLMRequest, LLMResponse  # импорт схем


app = FastAPI()

class LLMRequest(BaseModel):
    body_type: str  # Пример: "груша", "яблоко", "песочные часы"

@app.get("/")
async def root():
    return {"message": "llm-service is running"}

@app.post("/recommend")
def recommend_outfit(req: LLMRequest):
    result = get_recommendation(req.body_type)
    if result.startswith("LLM не ответил:"):
        # Вернем ошибку в корректной структуре, либо выбросим HTTPException
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=result)
    return result  # Оборачиваем строку в модель

