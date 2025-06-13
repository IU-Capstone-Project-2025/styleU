from pydantic import BaseModel

class BodyParams(BaseModel):
    bust: float
    waist: float
    hips: float
    height: float

class PredictionResult(BaseModel):
    body_type: str
