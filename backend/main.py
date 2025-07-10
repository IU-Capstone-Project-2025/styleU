import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from typing import Optional
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from validation import FigureRequest
from services.style_service import (
    analyze_body_type,
    analyze_color_type,
)
from authorization.dependencies import get_current_user_optional
from authorization.routes import router as auth_router
from databases.relational_db import get_db, init_models
from sqlalchemy.ext.asyncio import AsyncSession

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Initializing database...")
    await init_models()
    print("✅ Database initialized")
    yield
    print("🛑 App shutdown")

app = FastAPI(
    title="AI-Powered Stylist - StyleU",
    description=
        "An intelligent stylist that provides personalized outfit\
        suggestions based on user parameters.",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)


@app.get(
    "/api/hello",
    tags=["Check health"],
    summary="Health check",
    description="Returns a simple greeting message to verify that the server is running.",
)
def connect():
    return {"message": "Hello, World!"}


@app.post(
    "/analyze_figure",
    tags=["Style Service"],
    summary="Analyze body type",
    description="""
        Analyzes the user's body type based on physical parameters.

        Request Body (JSON)
        - height: Height in centimeters, e.g. 170 (float, range: 0–300)
        - bust: Chest circumference in centimeters (float, range: 0–300)
        - waist: Waist circumference in centimeters (float, range: 0–300)
        - hip: Hip circumference in centimeters (float, range: 0–300)

        Response (200 OK)
        ```json
        {
        ML specific response structure
        }
    """,
)
async def analyze_figure(
    request: FigureRequest,
    user: Optional[str] = Depends(get_current_user_optional),
):
    try:
        result = await analyze_body_type(
            height=request.height,
            bust=request.bust,
            waist=request.waist,
            hips=request.hips,
            username=user,
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
    user: Optional[str] = Depends(get_current_user_optional),
):
    try:
        result = await analyze_color_type(file=file, username=user)
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
