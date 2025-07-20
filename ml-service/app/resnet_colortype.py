import torch
from torchvision import models, transforms
from PIL import Image
import os
import torch.nn as nn
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
num_classes = 4

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "resnet_finetuned.pt")

model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 4)
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device("cpu")))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

inv_label_map = {0: "autumn", 1: "spring", 2: "summer", 3: "winter"}

def predict_color_type(image_path: str) -> str:
    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)  # (1, 3, 224, 224)

    with torch.no_grad():
        outputs = model(tensor)
        pred = outputs.argmax(dim=1).item()
        return inv_label_map[pred]