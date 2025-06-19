import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../model/body_model.joblib")
model = joblib.load(MODEL_PATH)

def predict_body_type(features: list[float]) -> str:
    prediction = model.predict([features])[0]
    return prediction
