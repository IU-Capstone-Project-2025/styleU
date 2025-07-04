from pydantic import BaseModel, Field


class FigureRequest(BaseModel):
    height: float = Field(..., gt=0, lt=300, description="Height in centimeters")
    bust: float = Field(..., gt=0, lt=300, description="Chest circumference in cm")
    waist: float = Field(..., gt=0, lt=300, description="Waist circumference in cm")
    hips: float = Field(..., gt=0, lt=300, description="Hip circumference in cm")
