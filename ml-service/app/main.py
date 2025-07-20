from fastapi import FastAPI, UploadFile, File
from typing import List
from app.schema import BodyParams, PredictionResult, ImagePath, PredictionColorResult
from app.model import predict_body_type
from app.colortype_model import get_features_from_image, predict_color_types
from app.avatar_generator.avatar_generator_run import generate_stylized_avatar_with_clothes
from pathlib import Path
import shutil
from fastapi.responses import StreamingResponse
from io import BytesIO
import io

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ml-service is running"}

@app.post("/predict", response_model=PredictionResult)
def predict(params: BodyParams):
    features = [params.bust, params.waist, params.hips, params.height, params.sex]
    body_type = predict_body_type(features)
    return {"body_type": body_type}

@app.post("/predict_color_type",response_model=PredictionColorResult)
def predict_color_type(params: ImagePath):
    features = get_features_from_image(params.path)
    color_type = predict_color_types(features)
    return {"color_type": color_type}

@app.post("/generate-avatar")
async def generate_avatar(image: UploadFile = File(...)):
    image_bytes = await image.read()
    generated_image_bytes = generate_stylized_avatar(image_bytes)
    return StreamingResponse(BytesIO(generated_image_bytes), media_type="image/jpeg", headers={
        "Content-Disposition": f"attachment; filename=avatar.jpg"
    })
    
    
@app.post("/generate-avatar_leonardo")
async def generate_avatar(
    face: UploadFile = File(...)
):

    face_bytes = await face.read()

    result = generate_stylized_avatar_with_clothes(face_bytes)
    return StreamingResponse(io.BytesIO(result), media_type="image/jpeg")