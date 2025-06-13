import httpx
from fastapi import UploadFile, File

from config import (
    PREDICT_BODY_TYPE_URL,
    PREDICT_COLOR_TYPE_URL,
)


async def analyze_body_type(
    gender: str,
    height: float,
    weight: float,
    chest: float,
    waist: float,
    hip: float,
):
    return {}
    '''
    async with httpx.AsyncClient() as client:
        response = await client.post(PREDICT_BODY_TYPE_URL, json={
            "gender": gender,
            "height": height,
            "weight": weight,
            "chest": chest,
            "waist": waist,
            "hip": hip
        })
        response.raise_for_status()
        return response.json()
    '''


async def analyze_color_type(
    file: UploadFile = File(...),
):
    return {}
    '''
    async with httpx.AsyncClient() as client:
        form = httpx.MultipartWriter()
        form.add_part(
            file.file,
            filename=file.filename,
            name="file",
            content_type=file.content_type
        )

        response = await client.post(
            PREDICT_COLOR_TYPE_URL,
            content=await form.read(),
            headers=form.headers
        )
        response.raise_for_status()
        return response.json()
    '''
