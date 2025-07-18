from pydantic import BaseModel

class BodyTypeRequest(BaseModel):
    body_type: str  # Пример: "груша", "яблоко", "песочные часы"
    sex: str

class ColorTypeRequest(BaseModel):
    color_type: str  # Пример: "весна", "лето", "осень", "зима"