import os

HF_TOKEN = os.getenv("HF_TOKEN")
print("HF_TOKEN:", HF_TOKEN)  # временно для отладки

if not HF_TOKEN:
    raise ValueError("HF_TOKEN не задан в переменных окружения")
