from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class LLMRequest(BaseModel):
    body_type: str  # Пример: "груша", "яблоко", "песочные часы"
    
    
@app.get("/")
async def root():
    return {"message": "llm-service is running"}

@app.post("/recommend")
def recommend_outfit(req: LLMRequest):
    prompt = f"""
Ты профессиональный стилист. Клиент имеет тип фигуры: {req.body_type}.
Дай короткие и практичные рекомендации по стилю одежды, фасонам и вещам, которые подойдут именно под этот тип фигуры, не более 3 предложений
"""
    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "mistral",
        "prompt": prompt.strip(),
        "stream": False
    })

    if response.status_code != 200:
        return {"error": "LLM не ответил"}

    result = response.json()
    return {
        "body_type": req.body_type,
        "recommendation": result.get("response", "Нет ответа от модели.")
    }
