from gradio_client import Client, handle_file
from gradio_client.exceptions import AppError
from pathlib import Path
import requests
import os
from dotenv import load_dotenv


load_dotenv() 
HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise ValueError("HF_TOKEN не задан в переменных окружения")

 
def generate_stylized_avatar(input_image_path: Path, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)

    client = Client("multimodalart/Ip-Adapter-FaceID", hf_token=HF_TOKEN)

    try:
        result = client.predict(
            images=[handle_file(str(input_image_path))],
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

    # Скачивание 
    # Это вариант скачивания фотки с локальной машины/диска
    image_url = result[0]['image']
    image_path = Path(image_url)  
    with open(image_path, "rb") as f:
        image_data = f.read()
    result_path = output_dir / f"{input_image_path.stem}_avatar.jpg"

    with open(result_path, 'wb') as f:
        f.write(image_data)

    return result_path
