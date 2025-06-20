import joblib
from PIL import Image
import numpy as np
from skimage.color import rgb2hsv
import os

model = joblib.load('random_forest_2.pkl')

image_path = "tests_cleaned_back/test10.jpg"

image = Image.open(image_path).convert('RGB')
image_np = np.array(image.resize((128, 128))) / 255.0

mean_rgb = image_np.mean(axis=(0, 1))
std_rgb = image_np.std(axis=(0, 1))

hsv = rgb2hsv(image_np)
mean_hsv = hsv.mean(axis=(0, 1))
std_hsv = hsv.std(axis=(0, 1))

features = np.concatenate([mean_rgb, std_rgb, mean_hsv, std_hsv])

h_hist, _ = np.histogram(hsv[:, :, 0], bins=8, range=(0, 1), density=True)
s_hist, _ = np.histogram(hsv[:, :, 1], bins=8, range=(0, 1), density=True)
v_hist, _ = np.histogram(hsv[:, :, 2], bins=8, range=(0, 1), density=True)

features = np.concatenate([features, h_hist, s_hist, v_hist])

prediction = model.predict([features])[0]

print(f"test.jpg: Predicted color type → {prediction}")
