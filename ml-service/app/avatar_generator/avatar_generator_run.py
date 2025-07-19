import os
import json
import requests
import tempfile
import time
from dotenv import load_dotenv

load_dotenv()

LEONARDO_API_KEY = os.getenv("LEONARDO_API_KEY")

if not LEONARDO_API_KEY:
    raise ValueError("LEONARDO_API_KEY не задан в .env")

authorization = f"Bearer {LEONARDO_API_KEY}"

HEADERS = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": authorization
}

PROXIES = {
    "http": "http://94.228.169.104:31289",
    "https": "http://94.228.169.104:31289",
}


def upload_image_to_leonardo(image_bytes: bytes, extension="png") -> str:
    url = "https://cloud.leonardo.ai/api/rest/v1/init-image"
    payload = {"extension": extension}

    init_resp = requests.post(url, headers=HEADERS, json=payload, proxies=PROXIES)
    init_resp.raise_for_status()

    init_data = init_resp.json()['uploadInitImage']
    upload_url = init_data['url']
    fields = json.loads(init_data['fields'])
    image_id = init_data['id']

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as temp_file:
        temp_file.write(image_bytes)
        temp_file_path = temp_file.name

    with open(temp_file_path, "rb") as f:
        upload_resp = requests.post(upload_url, data=fields, files={'file': f})
        upload_resp.raise_for_status()

    return image_id


def generate_avatar_with_refs(character_img_id: str, clothing_img_ids: list[str]) -> str:
    
    url = "https://cloud.leonardo.ai/api/rest/v1/generations"

    controlnets = [
        {
            "initImageId": character_img_id,
            "initImageType": "UPLOADED",
            "preprocessorId": 133,
            "strengthType": "High",
            "influence": 0.5
        }
    ]

    for cloth_id in clothing_img_ids:
        controlnets.append({
            "initImageId": cloth_id,
            "initImageType": "UPLOADED",
            "preprocessorId": 67,
            "strengthType": "High",
            "influence": 1.0
        })

    payload = {
        "prompt": 
        "Full body Bratz doll, standing pose, photorealistic face from reference image, "
        "wearing the exact clothes from the style reference images, "
        "sharp textures, doll in studio light, plain background"
        ,
        # "negativePrompt": "blurry, cropped, multiple people, watermark, logo, back view, doll cut off",
        "modelId": "6b645e3a-d64f-4341-a6d8-7a3690fbf042",
        "width": 512,
        "height": 768,
        "num_images": 1,
        "alchemy": True,
        "controlnets": controlnets
    }

    resp = requests.post(url, headers=HEADERS, json=payload, proxies=PROXIES)
    resp.raise_for_status()
    return resp.json()['sdGenerationJob']['generationId']


def poll_generation(generation_id):
    url = f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}"

    for _ in range(60):
        response = requests.get(url, headers=HEADERS, proxies=PROXIES)

        try:
            data = response.json()
        except Exception:
            raise RuntimeError(f"Invalid JSON response: {response.text}")

        gen_data = data.get("generations_by_pk")
        if not gen_data:
            raise RuntimeError(f"Missing 'generations_by_pk' in response: {data}")

        status = gen_data["status"]

        if status == "COMPLETE":
            images = gen_data.get("generated_images", [])
            if not images:
                raise RuntimeError("No images found in generation result")
            return images[0]["url"]

        elif status == "FAILED":
            raise RuntimeError("Generation failed")

        time.sleep(1)

    raise TimeoutError("Image generation timed out")




def generate_stylized_avatar_with_clothes(face_image: bytes, clothing_images: list[bytes]) -> bytes:
    """Главная функция: принимает 1 лицо + 3 одежды, возвращает байты сгенерированного образа"""
    face_id = upload_image_to_leonardo(face_image)
    clothing_ids = [upload_image_to_leonardo(img) for img in clothing_images]

    generation_id = generate_avatar_with_refs(face_id, clothing_ids)
    final_url = poll_generation(generation_id)

    # Скачивание готовой картинки
    final_resp = requests.get(final_url)
    final_resp.raise_for_status()
    return final_resp.content
