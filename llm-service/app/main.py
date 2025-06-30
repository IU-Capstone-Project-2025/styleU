from fastapi import FastAPI
from app.llm_client import get_recommendation
from app.llm_client import get_recommendation_by_color_type
from app.schema import BodyTypeRequest, ColorTypeRequest  # импорт схем


app = FastAPI()


    
@app.get("/")
async def root():
    return {"message": "llm-service is running"}

@app.post("/recommend")
def recommend_outfit(req: BodyTypeRequest):
    result = get_recommendation(req.body_type)
    # Если пришла ошибка, возвращаем в формате JSON
    if result.startswith("LLM не ответил:"):
        # Вернем ошибку в корректной структуре, либо выбросим HTTPException
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=result)
    return result  # Оборачиваем строку в модель

@app.post("/recommend_by_color_type")
def recommend_by_color_type(req: ColorTypeRequest):
    result = get_recommendation_by_color_type(req.color_type)
    if result.startswith("LLM не ответил:"):
        # Вернем ошибку в корректной структуре, либо выбросим HTTPException
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=result)
    return result  # Оборачиваем строку в модель
