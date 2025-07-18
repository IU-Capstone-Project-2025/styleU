from pydantic import BaseModel

class BodyParams(BaseModel):
    bust: float
    waist: float
    hips: float
    height: float
    sex: str

class PredictionResult(BaseModel):
    body_type: str

class ImagePath(BaseModel):
    path: str

class PredictionColorResult(BaseModel):
    color_type: str
