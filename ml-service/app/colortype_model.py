import os
import joblib
from PIL import Image
import numpy as np
from skimage.color import rgb2hsv

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "random_forest.pkl")
model = joblib.load(MODEL_PATH)

label_map = {
    'autumn': 0,
    'spring': 1,
    'summer': 2,
    'winter': 3
}
inv_label_map = {v: k for k, v in label_map.items()}

def predict_color_types(features: list[float]) -> str:
    prediction = model.predict(features)[0]
    return inv_label_map[prediction]

def get_features_from_image(image_path: str) -> list[float]:
    X = []
    image = Image.open(image_path).convert('RGB')
    image_np = np.array(image.resize((128, 128))) / 255.0 

    mean_rgb = image_np.mean(axis=(0, 1))  # mean rgb
    hsv = rgb2hsv(image_np)                # convert to HSV
    mean_hsv = hsv.mean(axis=(0, 1))       # mean hsv 
    std_rgb = image_np.std(axis=(0, 1))    # std rgb
    std_hsv = hsv.std(axis=(0, 1))         # std hsv

    features = np.concatenate([mean_rgb, std_rgb, mean_hsv, std_hsv])

    h_hist, _ = np.histogram(hsv[:, :, 0], bins=8, range=(0, 1), density=True)
    s_hist, _ = np.histogram(hsv[:, :, 1], bins=8, range=(0, 1), density=True)
    v_hist, _ = np.histogram(hsv[:, :, 2], bins=8, range=(0, 1), density=True)

    features = np.concatenate([features, h_hist, s_hist, v_hist])

    X.append(features)
    return X
