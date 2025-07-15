import httpx
from fastapi import HTTPException
from databases.database_connector import DatabaseConnector
from config import PARSER_URL


async def suggest_outfits_for_user(user: str, query: str, size: str, color: str, material: str, style: str):
    async with DatabaseConnector() as connector:
        user_data = await connector.get_user_features(user)

    if not user_data:
        raise ValueError("Сначала пройдите анализ цветотипа и фигуры")

    color_type = user_data.get("color_type")
    body_shape = user_data.get("body_type")

    form_data = {
        "query": query,
        "size": size,
        "color": color,
        "material": material,
        "style": style,
        "color_type": color_type,
        "body_shape": body_shape,
    }

    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            response = await client.post(PARSER_URL, data=form_data)
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Parser service unavailable: {exc}")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to get response from parser")

    try:
        outfits = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parser returned invalid JSON: {str(e)}")

    return {"outfits": outfits}
