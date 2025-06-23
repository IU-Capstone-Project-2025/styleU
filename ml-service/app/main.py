from fastapi import FastAPI
from app.schema import BodyParams, PredictionResult, ImagePath, PredictionColorResult
from app.model import predict_body_type
from app.colortype_model import get_features_from_image, predict_color_types

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ml-service is running"}

@app.post("/predict", response_model=PredictionResult)
def predict(params: BodyParams):
    features = [params.bust, params.waist, params.hips, params.height]
    body_type = predict_body_type(features)
    return {"body_type": body_type}

@app.post("/predict_color_type",response_model=PredictionColorResult)
def predict_color_type(params: ImagePath):
    features = get_features_from_image(params.path)
    color_type = predict_color_types(features)
    return {"color_type": color_type}
