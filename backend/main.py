import logging
logging.basicConfig(
    filename="backend.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

import uvicorn
from functools import wraps
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request, status
from typing import Optional
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from validation import FigureRequest, OutfitRequest, FavoriteOutfitRequest
from services.style_service import (
    analyze_body_type,
    analyze_color_type,
    get_user_features,
)
from services.statistic import like_action, get_all_statistics
from services.user_service import generate_avatar_from_saved_photo
from services.outfit_service import (
    suggest_outfits_for_user,
    add_favorite_outfit,
    get_favorite_outfits,
)
from authorization.dependencies import get_current_user_optional, get_current_user
from authorization.routes import router as auth_router
from databases.relational_db import init_models


def log_endpoint(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        logging.info(f"Endpoint called: {func.__name__}")
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            logging.error(f"Error in {func.__name__}: {str(e)}")
            raise
    return wrapper


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
@log_endpoint
def connect():
    return {"message": "Hello, World!"}


@app.post(
    "/analyze_figure",
    tags=["Style Service"],
    summary="Analyze body type",
    description="""
        Analyzes the user's body type based on physical parameters.

        Request Body (JSON)
        - sex: Male or female (string)
        - height: Height in centimeters, e.g. 170 (float, range: 0–300)
        - bust: Chest circumference in centimeters (float, range: 0–300)
        - waist: Waist circumference in centimeters (float, range: 0–300)
        - hip: Hip circumference in centimeters (float, range: 0–300)

        Response (200 OK)
        ```json
        {
        ML specific response structure
        }
        ```
    """,
)
@log_endpoint
async def analyze_figure(
    request: FigureRequest,
    user: Optional[str] = Depends(get_current_user_optional),
):
    try:
        result = await analyze_body_type(
            sex = request.sex,
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
        ```
    """
)
@log_endpoint
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
    "/get_user_parameters",
    tags=["Style Service"],
    summary="Get user features",
    description="""
        Returns the user's saved body type, color type and recommendations.

        **Requires authorization**.

        Response (200 OK)
        ```json
        {
            "sex": "male",  // or "female",
            "height": 170.0,
            "body_type": "hourglass",  // or other body types,
            "body_type_reccommendation": "ML specific response structure",
            "color_type": "spring",  // or "summer", "autumn", "winter"
            "color_type_reccommendation": "ML specific response structure",
        }
        ```
    """,
)
@log_endpoint
async def get_user_parameters(
    user: str = Depends(get_current_user),
):
    try:
        features = await get_user_features(username=user)
        return JSONResponse(content=features)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении параметров пользователя: {str(e)}")


@app.post(
    "/suggest_outfits",
    tags=["Outfit Service"],
    summary="Suggest outfits",
    description="""
        Selects outfits based on the entered query, the user's preferences 
        (size, style, color, material), as well as his saved color_type and body_type.

        **Requires authorization**.

        Form parameters (multipart/form-data):
        - query: The desired outfit
        - size: The size of the user (for example, "S", "M", "44", "46-48")
        - price_min: Minimum price
        - price_max: Maximum price
        - extra_info: Additional information
        - style: Preferred style

        Response (200 OK)
        ```json
        {
        ML specific response structure
        }
        ```
    """,
)
@log_endpoint
async def suggest_outfits(
    request: OutfitRequest,
    user: str = Depends(get_current_user),
):
    try:
        outfits = await suggest_outfits_for_user(
            user=user,
            query=request.query,
            size=request.size,
            price_min=request.price_min,
            price_max=request.price_max,
            extra_info=request.extra_info,
            style=request.style,
        )
        return JSONResponse(content=outfits)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при подборе образов: {str(e)}")


@app.post(
    "/add_to_favorites",
    tags=["Outfit Service"],
    summary="Add outfit to favorites",
    description="""
        Adds the selected outfit to the user's favorites.
        
        **Requires authorization**.

        Request Body (JSON):
        ```json
        {
        "items": [
            {
            "image": "https://example.com/image1.jpg",
            "link": "https://marketplace.com/item/123",
            "price": 2499,
            "marketplace": "Wildberries",
            "reason": "Подходит для вашего цветотипа"
            },
            {
            "image": "https://example.com/image2.jpg",
            "link": "https://marketplace.com/item/456",
            "price": 3199,
            "marketplace": "Lamoda",
            "reason": "Выделяет талию"
            }
        ],
        "totalReason": "Образ подчеркивает фигуру и соответствует вашему стилю",
        "totalReason_en": "The outfit highlights your body shape and fits your style"
        }
        ```

        Response (200 OK)
        ```json
        {
            "message": "Outfit added to favorites"
        }
        ```
    """,
)

@log_endpoint
async def add_to_favorites(
    outfit: FavoriteOutfitRequest,
    user: str = Depends(get_current_user),
):
    try:
        response = await add_favorite_outfit(user=user, outfit=outfit.model_dump())
        return JSONResponse(content=response)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при добавлении образа в избранное: {str(e)}")


@app.get(
    "/get_favorites",
    tags=["Outfit Service"],
    summary="Get favorite outfits",
    description="""
        Returns the user's favorite outfits.

        **Requires authorization**.

        Response (200 OK)
        ```json
        {
        "items": [
            {
            "image": "https://example.com/image1.jpg",
            "link": "https://marketplace.com/item/123",
            "price": 2499,
            "marketplace": "Wildberries",
            "reason": "Подходит для вашего цветотипа"
            },
            {
            "image": "https://example.com/image2.jpg",
            "link": "https://marketplace.com/item/456",
            "price": 3199,
            "marketplace": "Lamoda",
            "reason": "Выделяет талию"
            }
        ],
        "totalReason": "Образ подчеркивает фигуру и соответствует вашему стилю",
        "totalReason_en": "The outfit highlights your body shape and fits your style"
        }
        ```
    """,
)
@log_endpoint
async def get_favorites(
    user: str = Depends(get_current_user),
):
    try:
        outfits = await get_favorite_outfits(user=user)
        return JSONResponse(content=outfits)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении избранных образов: {str(e)}")



@app.post("/generate_avatar")
@log_endpoint
async def generate_avatar(user: str = Depends(get_current_user)):
    try:
        return await generate_avatar_from_saved_photo(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Сначала пройдите определение цветотипа.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при генерации аватара: {str(e)}")


@app.post(
    "/like_figure_analization",
    tags=["Statistics"],
    summary="Like figure analysis"
)
@log_endpoint
async def like_figure():
    await like_action("figure", "like")
    return {"message": "Figure analysis liked"}


@app.post(
    "/dislike_figure_analization",
    tags=["Statistics"],
    summary="Dislike figure analysis"
)
@log_endpoint
async def dislike_figure():
    await like_action("figure", "dislike")
    return {"message": "Figure analysis disliked"}


@app.post(
    "/like_color_type_analization",
    tags=["Statistics"],
    summary="Like color type analysis"
)
@log_endpoint
async def like_color():
    await like_action("color", "like")
    return {"message": "Color type liked"}


@app.post(
    "/dislike_color_type_analization",
    tags=["Statistics"],
    summary="Dislike color type analysis"
)
@log_endpoint
async def dislike_color():
    await like_action("color", "dislike")
    return {"message": "Color type disliked"}


@app.post(
    "/like_outfit_suggestion",
    tags=["Statistics"],
    summary="Like outfit suggestion"
)
@log_endpoint
async def like_outfit():
    await like_action("outfit", "like")
    return {"message": "Outfit suggestion liked"}


@app.post(
    "/dislike_outfit_suggestion",
    tags=["Statistics"],
    summary="Dislike outfit suggestion"
)
@log_endpoint
async def dislike_outfit():
    await like_action("outfit", "dislike")
    return {"message": "Outfit suggestion disliked"}


@app.post(
    "/like_avatar_generation",
    tags=["Statistics"],
    summary="Like avatar generation"
)
@log_endpoint
async def like_avatar():
    await like_action("avatar", "like")
    return {"message": "Avatar generation liked"}


@app.post(
    "/dislike_avatar_generation",
    tags=["Statistics"],
    summary="Dislike avatar generation"
)
@log_endpoint
async def dislike_avatar():
    await like_action("avatar", "dislike")
    return {"message": "Avatar generation disliked"}


@app.get(
    "/statistics",
    tags=["Statistics"],
    summary="Get statistics",
    description="Returns statistics on user feedback for various actions."
)
@log_endpoint
async def statistics():
    stats = await get_all_statistics()
    return JSONResponse(content=stats, status_code=status.HTTP_200_OK)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
