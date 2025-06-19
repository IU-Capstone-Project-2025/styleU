import joblib
from PIL import Image
import numpy as np
from skimage.color import rgb2hsv

path = input("Enter the path to the image: ")

model = joblib.load('C:/Users/Kistanov/Desktop/capstone/styleU/ml/color_type_clip/random_forest.pkl')
X = []

image = Image.open(path).convert('RGB')
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

prediction = model.predict(X)

print("Predicted color type: ", prediction)