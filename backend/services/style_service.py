import httpx
import tempfile
import shutil
import os
from fastapi import UploadFile, File, HTTPException

from config import (
    PREDICT_BODY_TYPE_ML_URL,
    PREDICT_BODY_TYPE_LLM_URL,
    PREDICT_COLOR_TYPE_URL,
)


async def analyze_body_type(
    height: float,
    bust: float,
    waist: float,
    hips: float,
):
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            ml_response = await client.post(
                PREDICT_BODY_TYPE_ML_URL, 
                json={
                    "bust": bust,
                    "waist": waist,
                    "hips": hips,
                    "height": height,
                }
            )
            ml_response.raise_for_status()
            body_type = ml_response.json()["body_type"]

            llm_response = await client.post(
                PREDICT_BODY_TYPE_LLM_URL, 
                json={
                    "body_type": body_type,
                }
            )
            llm_response.raise_for_status()
            recommendation = llm_response.json()

            return {
                "body_type": body_type,
                "recommendation": recommendation,
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Request error: {str(e)}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Service error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


async def analyze_color_type(
    file: UploadFile = File(...),
):
    try:
        suffix = os.path.splitext(file.filename)[-1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        async with httpx.AsyncClient() as client:
            response = await client.post(PREDICT_COLOR_TYPE_URL, json={"path": temp_path})
            response.raise_for_status()
            result = response.json()

        return result

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
