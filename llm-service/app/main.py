from fastapi import FastAPI
from pydantic import BaseModel
from app.llm_client import get_recommendation

app = FastAPI()

class LLMRequest(BaseModel):
    body_type: str  # Пример: "груша", "яблоко", "песочные часы"

@app.get("/")
async def root():
    return {"message": "llm-service is running"}

@app.post("/recommend")
def recommend_outfit(req: LLMRequest):
    result = get_recommendation(req.body_type)
    # Если пришла ошибка, возвращаем в формате JSON
    if result.startswith("LLM не ответил:"):
        return {"error": result}
    return result
