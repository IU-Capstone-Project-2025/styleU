from pydantic import BaseModel, Field
from typing import List, Optional


class FigureRequest(BaseModel):
    sex: str = Field(..., description="Male or female")
    height: float = Field(..., gt=0, lt=300, description="Height in centimeters")
    bust: float = Field(..., gt=0, lt=300, description="Chest circumference in cm")
    waist: float = Field(..., gt=0, lt=300, description="Waist circumference in cm")
    hips: float = Field(..., gt=0, lt=300, description="Hip circumference in cm")


class OutfitRequest(BaseModel):
    query: str = Field(...)
    size: str = Field(...)
    price_min: str = Field(...)
    price_max: str = Field(...)
    extra_info: str = Field(...)
    style: str = Field(...)


class FavoriteItem(BaseModel):
    image: str = Field(..., description="URL to the item image")
    link: str = Field(..., description="URL to the item on the marketplace")
    price: float = Field(..., gt=0, description="Price of the item")
    marketplace: str = Field(..., description="Marketplace name (e.g., Wildberries, Lamoda)")
    reason: str = Field(..., description="Recommendation explanation in Russian")


class FavoriteOutfitRequest(BaseModel):
    items: List[FavoriteItem] = Field(..., description="List of outfit items")
    totalReason: str = Field(..., description="Overall outfit explanation in Russian")
    totalReason_en: Optional[str] = Field(None, description="Overall explanation in English (optional)")
