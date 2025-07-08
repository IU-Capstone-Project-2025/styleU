from fastapi import FastAPI, UploadFile, File
from app.schema import BodyParams, PredictionResult, ImagePath, PredictionColorResult
from app.model import predict_body_type
from app.colortype_model import get_features_from_image, predict_color_types
from app.faceid_adapter.faceid_adapter_run import generate_stylized_avatar
from pathlib import Path
import shutil

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

@app.post("/generate-avatar/")
async def generate_avatar(image: UploadFile = File(...)):
    # Сохраняем загруженный файл во временную директорию
    input_path = Path(f"temp_inputs/{image.filename}")
    input_path.parent.mkdir(parents=True, exist_ok=True)
    with input_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Путь для вывода
    output_dir = Path("generated_faces")
    result_path = generate_stylized_avatar(input_path, output_dir)

    return {"generated_image": str(result_path)}