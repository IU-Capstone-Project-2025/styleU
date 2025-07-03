import os
import re
from together import Together
from dotenv import load_dotenv

load_dotenv()

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


def get_recommendation_by_color_type(color_type: str) -> str:
    prompt = f"""
    Ты профессиональный стилист. Клиент имеет цветотип лица : {color_type}.
    Дай рекомендации по образам, мейкапу и вещам, которые подойдут именно под этот цветотип. Не более 5 предложений.
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