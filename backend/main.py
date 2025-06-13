import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from validation import FigureRequest
from services.style_service import (
    analyze_body_type,
    analyze_color_type,
)


app = FastAPI(
    title="AI-Powered Stylist - StyleU",
    description=
        "An intelligent stylist that provides personalized outfit\
        suggestions based on user parameters.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/api/hello",
    tags=["Check health"],
    summary="Health check",
    description="Returns a simple greeting message to verify that the server is running.",
)
def connect():
    return {"message": "Hello, World!"}


@app.post(
    "/auth/login",
    tags=["Authentication"],
    summary="Login endpoint",
    description="Placeholder for user authentication. Will be implemented later.",
)
def login():
    try:
        return {"message": "Not implemented yet"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.post(
    "/analyze_figure",
    tags=["Style Service"],
    summary="Analyze body type",
    description="""
        Analyzes the user's body type based on physical parameters.

        Request Body (JSON)
        - gender: "male" or "female" (string)
        - height: Height in centimeters, e.g. 170 (float, range: 0–300)
        - weight: Weight in kilograms, e.g. 60 (float, range: 0–500)
        - chest: Chest circumference in centimeters (float, range: 0–300)
        - waist: Waist circumference in centimeters (float, range: 0–300)
        - hip: Hip circumference in centimeters (float, range: 0–300)

        Response (200 OK)
        ```json
        {
        ML specific response structure
        }
    """,
)
async def analyze_figure(request: FigureRequest):
    try:
        result = await analyze_body_type(
            gender=request.gender.value,
            height=request.height,
            weight=request.weight,
            chest=request.chest,
            waist=request.waist,
            hip=request.hip,
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/analyze_color",
    tags=["Style Service"],
    summary="Analyze color type",
    description="""
        Analyzes user's color type (seasonal color analysis) based on a portrait image.

        Request (multipart/form-data)
        - file: Required image file (`.jpg`, `.png`, etc.) containing a clear photo
        of the user (preferably face only, well-lit, without filters or makeup).

        Response (200 OK)
        Example response:
        ```json
        {
        ML specific response structure
        }
    """
)
async def analyze_color(
    file: UploadFile = File(...),
):
    try:
        result = await analyze_color_type(file)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/find_products",
    tags=["Clothing Service"],
    summary="Find clothes",
    description="""
        Finds clothing products based on user preferences and body type.
        Not implemented yet.
    """
)
def find_products():
    try:
        return {"message": "Not implemented yet"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/suggest_outfits",
    tags=["Outfit Service"],
    summary="Suggest outfits",
    description="""
        Suggests outfits based on user's body type and color type.
        Not implemented yet.
    """
)
def suggest_outfits():
    try:
        return {"message": "Not implemented yet"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
