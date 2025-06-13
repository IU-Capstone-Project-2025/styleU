from enum import Enum
from pydantic import BaseModel, Field


class GenderEnum(str, Enum):
    male = "male"
    female = "female"

class FigureRequest(BaseModel):
    gender: GenderEnum
    height: float = Field(..., gt=0, lt=300, description="Height in centimeters")
    weight: float = Field(..., gt=0, lt=500, description="Weight in kilograms")
    chest: float = Field(..., gt=0, lt=300, description="Chest circumference in cm")
    waist: float = Field(..., gt=0, lt=300, description="Waist circumference in cm")
    hip: float = Field(..., gt=0, lt=300, description="Hip circumference in cm")
