import os
import re
from together import Together
from dotenv import load_dotenv
load_dotenv()
# Замените на ваш Together API ключ или загрузите из переменных окружения
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")#, "tgp_v1_csP8LvbZxwYnHQqdOVGEq-7fSV0fJHCwO8lAGAy1cQY")

# Инициализация клиента
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
        # Удаляем блок <think>...</think> (вместе с тегами)
        recommendation = re.sub(r"<think>.*?</think>", "", raw_output, flags=re.DOTALL).strip()
        return recommendation
    except Exception as e:
        return f"LLM не ответил: {str(e)}"
