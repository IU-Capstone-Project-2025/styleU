import os
import re
import json
from together import Together
from dotenv import load_dotenv

load_dotenv()  # загрузка переменных окружения из .env

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
if not TOGETHER_API_KEY:
    raise ValueError("TOGETHER_API_KEY не задан в переменных окружения")


client = Together(api_key=TOGETHER_API_KEY)

MODEL_NAME = "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free"

def get_recommendation(body_type: str) -> str:
    prompt = f"""
    Ты профессиональный стилист. Клиент имеет тип фигуры: {body_type}.
    Дай короткие и практичные рекомендации по стилю одежды, фасонам и вещам, которые подойдут именно под этот тип фигуры. Не более 3 предложений.
    """.strip()

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "Ты модный стилист. Отвечай кратко и по делу."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        raw_output = response.choices[0].message.content
        recommendation = re.sub(r"<think>.*?</think>", "", raw_output, flags=re.DOTALL).strip()
        return recommendation
    except Exception as e:
        return f"LLM не ответил: {str(e)}"



def get_recommendation_by_color_type(color_type: str) -> dict:

    prompt = f"""
Ты — профессиональный стилист-колорист. Клиент имеет цветотип: {color_type}.
Сформируй ответ строго в JSON-формате со следующей структурой:

{{
  "color_type": "<название цветотипа>",
  "recommendation": {{
    "about": "<краткое описание цветотипа — не более 5 предложений>",
    "suitable_colors": {{
      "description": "<описание подходящих цветов для одежды, макияжа и аксессуаров и почему они подходят>",
      "palette": ["#HEX", "#HEX", ...]  // минимум 5 натуральных, уместных цветов
    }},
    "unsuitable_colors": {{
      "description": "<описание неподходящих цветов и почему они не подходят>",
      "palette": ["#HEX", "#HEX", ...]  // минимум 4 ярких/холодных/неуместных цвета
    }}
  }}
}}

Требования:
- Не добавляй пояснений и markdown.
- Строго соблюдай структуру JSON.
- Цвета должны быть в виде валидных HEX-кодов.
- Не пиши ничего вне JSON.
""".strip()


    try:
        response = client.chat.completions.create(
            model=MODEL_NAME, 
            messages=[
                {"role": "system", "content": "Ты модный стилист. Отвечай кратко и по делу."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        raw_output = response.choices[0].message.content or ""

        print("LLM raw output:", repr(raw_output))

        # Удалим <think>...</think>
        clean = re.sub(r"<think>.*?</think>", "", raw_output, flags=re.DOTALL).strip()

        # Удалим markdown-блок
        clean = re.sub(r"^```json\s*|\s*```$", "", clean, flags=re.MULTILINE).strip()

        # Попробуем распарсить
        return json.loads(clean)

    except Exception as e:
        return {
            "about": "",
            "suitable_colors": "",
            "unsuitable_colors": "",
            "error": f"LLM не ответил: {str(e)}"
        }
