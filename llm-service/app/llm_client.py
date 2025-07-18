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

MODEL_NAME = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"

def get_recommendation(body_type: str, sex: str) -> dict:
    prompt = f"""
Ты профессиональный стилист. Клиент имеет пол {sex} и тип фигуры: {body_type}.
Сформируй ответ строго в JSON следующей структуры:

{{
  "rus": {{
    "description": "<краткое описание типа фигуры на русском — не более 5 предложений>",
    "recommendation": "<краткие, практичные и точные рекомендации по стилю одежды и фасонам, которые подойдут именно под этот тип фигуры — не более 5 предложений>"
  }},
  "eng": {{
    "description": "<short description of the body type in English — max 3 sentences>",
    "recommendation": "<brief, practical and precise style recommendations suitable for this body type — max 5 sentences>"
  }}
}}

Требования:
- Не добавляй никаких пояснений, комментариев, markdown или текста вне JSON.
- Структура должна быть строго как указано выше.
- Начинай ответ сразу с {{
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
        print("RAW RESPONSE:\n", raw_output)

        # Удаляем <think>...</think> и markdown
        clean = re.sub(r"<think>.*?</think>", "", raw_output, flags=re.DOTALL).strip()
        clean = re.sub(r"^```json\s*|\s*```$", "", clean, flags=re.MULTILINE).strip()

        if not clean.startswith("{"):
            return {
                "error": "Ответ не является корректным JSON.",
                "raw_output": raw_output,
                "cleaned_output": clean
            }

        return json.loads(clean)

    except json.JSONDecodeError as json_err:
        return {
            "error": f"Ошибка декодирования JSON: {str(json_err)}",
            "raw_output": raw_output
        }
    except Exception as e:
        return {
            "error": f"Произошла ошибка: {str(e)}"
        }


def get_recommendation_by_color_type(color_type: str) -> dict:
    prompt = f"""
Ты — профессиональный стилист-колорист. Клиент имеет цветотип: {color_type}.
Сформируй ответ в двух отдельных JSON-блоках — один на русском языке, другой на английском. Каждый блок должен иметь строго следующую структуру:

{{
  "color_type": "<название цветотипа>",
  "recommendation": {{
    "about": "<краткое описание цветотипа — не более 5 предложений>",
    "suitable_colors": {{
      "description": "<описание подходящих цветов для одежды, макияжа и аксессуаров и почему они подходят>",
      "palette": ["#HEX", "#HEX", "#HEX", "#HEX", "#HEX"]
    }},
    "unsuitable_colors": {{
      "description": "<описание неподходящих цветов и почему они не подходят>",
      "palette": ["#HEX", "#HEX", "#HEX", "#HEX"]
    }}
  }}
}}

Требования:
- Сначала выдай JSON на русском, затем сразу второй JSON — на английском.
- Не добавляй никаких пояснений, комментариев, markdown или текста вне JSON.
- Цвета указывай только в виде валидных HEX-кодов.
- Строго соблюдай структуру JSON.
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

        # Удаляем <think>...</think> и markdown-блоки
        clean = re.sub(r"<think>.*?</think>", "", raw_output, flags=re.DOTALL).strip()
        clean = re.sub(r"^```json\s*|\s*```$", "", clean, flags=re.MULTILINE).strip()

        # Разделяем по границе JSON: символ } затем любые пробельные символы, затем {
        parts = re.split(r"}\s*{", clean)

        if len(parts) < 2:
            raise ValueError("Не удалось разделить два JSON-блока")

        # Восстанавливаем корректные JSON-строки (т.к. split удалил } и { между блоками)
        first_json_str = parts[0] + "}"
        second_json_str = "{" + parts[1]

        russian_json = json.loads(first_json_str)
        english_json = json.loads(second_json_str)

        return {
            "rus": russian_json,
            "eng": english_json
        }

    except Exception as e:
        return {
            "rus": {},
            "eng": {},
            "error": f"Ошибка при обработке: {str(e)}"
        }
