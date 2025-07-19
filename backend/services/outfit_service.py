import httpx
from fastapi import HTTPException
from databases.database_connector import DatabaseConnector
from config import PARSER_URL


async def suggest_outfits_for_user(
    user: str,
    query: str,
    size: str,
    price_min: str,
    price_max: str,
    extra_info: str,
    style: str,
):
    async with DatabaseConnector() as connector:
        user_data = await connector.get_user_features(user)

    if not user_data:
        raise ValueError("Сначала пройдите анализ цветотипа и фигуры")

    color_type = user_data.get("color_type")
    body_shape = user_data.get("body_type")
    sex = user_data.get("sex")

    data = {
        "query": query,
        "size": size,
        "price_min": price_min,
        "price_max": price_max,
        "extra_info": extra_info,
        "sex": sex,
        "style": style,
        "color_type": color_type,
        "body_shape": body_shape,
    }

    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            response = await client.post(PARSER_URL, data=data)
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Parser service unavailable: {exc}")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to get response from parser")

    return response.json()


async def add_favorite_outfit(user: str, outfit: dict):
    async with DatabaseConnector() as connector:
        user_data = await connector.get_user_by_username(user)

    if not user_data:
        raise ValueError("User not found")

    async with DatabaseConnector() as connector:
        await connector.add_favorite_outfit(user_data.id, outfit)

    return {"message": "Outfit added to favorites"}


async def get_favorite_outfits(user: str):
    async with DatabaseConnector() as connector:
        user_data = await connector.get_user_by_username(user)

    if not user_data:
        raise ValueError("User not found")

    outfits = await connector.get_favorite_outfits(user_data.id)

    return outfits
