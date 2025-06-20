from fastapi import FastAPI
from app.schema import BodyParams, PredictionResult
from app.model import predict_body_type
from app.colortype_model import get_features_from_image, predict_color_type

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ml-service is running"}

@app.post("/predict", response_model=PredictionResult)
def predict(params: BodyParams):
    features = [params.bust, params.waist, params.hips, params.height]
    body_type = predict_body_type(features)
    return {"body_type": body_type}

@app.post("/predict_color_type",response_model=PredictionResult)
def predict_color_type(params: str):
    features = get_features_from_image(params)
    color_type = predict_color_type(features)
    return {"color_type": color_type}
