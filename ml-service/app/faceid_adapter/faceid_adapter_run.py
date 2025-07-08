from gradio_client import Client, handle_file
from gradio_client.exceptions import AppError
from pathlib import Path
import requests
import os
from dotenv import load_dotenv
import tempfile

load_dotenv() 
HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise ValueError("HF_TOKEN не задан в переменных окружения")

 
import tempfile

def generate_stylized_avatar(input_image: bytes) -> bytes:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_input:
        temp_input.write(input_image)
        temp_input_path = temp_input.name

    client = Client("multimodalart/Ip-Adapter-FaceID", hf_token=HF_TOKEN)

    try:
        result = client.predict(
            images=[handle_file(temp_input_path)],
            prompt="in bratz style",
            negative_prompt="blurry, low quality",
            preserve_face_structure=True,
            face_strength=1.3,
            likeness_strength=1,
            nfaa_negative_prompt="naked, bikini, skimpy, scanty, bare skin, lingerie, swimsuit, exposed, see-through",
            api_name="/generate_image"
        )
    except AppError as e:
        raise RuntimeError(f"Gradio app error: {str(e)}")

    image_url = result[0]['image']
    with open(image_url, "rb") as f:
        return f.read()

