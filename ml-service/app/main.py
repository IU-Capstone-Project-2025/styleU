from fastapi import FastAPI
from app.schema import BodyParams, PredictionResult
from app.model import predict_body_type

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ml-service is running"}

@app.post("/predict", response_model=PredictionResult)
def predict(params: BodyParams):
    features = [params.bust, params.waist, params.hips, params.height]
    body_type = predict_body_type(features)
    return {"body_type": body_type}
