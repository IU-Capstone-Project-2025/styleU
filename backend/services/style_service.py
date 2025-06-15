import httpx
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
