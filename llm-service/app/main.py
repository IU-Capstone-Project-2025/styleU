from fastapi import FastAPI
from app.llm_client import get_recommendation
from app.llm_client import get_recommendation_by_color_type
from app.schema import BodyTypeRequest, ColorTypeRequest  # импорт схем
from fastapi import HTTPException

app = FastAPI()


    
@app.get("/")
async def root():
    return {"message": "llm-service is running"}

@app.post("/recommend")
def recommend_outfit(req: BodyTypeRequest):
    result = get_recommendation(req.body_type)
    # Если пришла ошибка, возвращаем в формате JSON
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/recommend_by_color_type")
def recommend_by_color_type(req: ColorTypeRequest):
    result = get_recommendation_by_color_type(req.color_type)

    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return result