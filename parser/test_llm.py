
import requests
import traceback
from together import Together

DEEPSEEK_API_KEY = "d6c15ee0b57f97707f05b2661455333de5db0666fcd25b4cfdb2832e55648d27"

client = Together(api_key="d6c15ee0b57f97707f05b2661455333de5db0666fcd25b4cfdb2832e55648d27")

def llm_refine_query(user_input: str, size: str, material: str, style: str, color_type: str, body_shape: str) -> str:
    prompt = (
        f"Пользователь ищет одежду с такими параметрами:\n"
        f"Запрос: {user_input}\n"
        f"Размер: {size}\n"
        f"Материал: {material}\n"
        f"Стиль: {style}\n"
        f"Цветотип: {color_type}\n"
        f"Фигура: {body_shape}\n\n"
        f"Сформируй краткий, но точный поисковый запрос для Wildberries или любого магазина одежды.\n"
        f"Верни только поисковую фразу без пояснений."
    )

    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3",
            messages=[
                {
                    "role": "system",
                    "content": "Ты модный ассистент. Преобразуй описание одежды и параметры пользователя в короткий поисковый запрос. Не упоминай фигуру и цветотип явно, а подбирай соответствующую форму и оттенок. Обязательно указывай вид одежды (юбка, платье, куртка и т.д.)."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            stream=False
        )

        content = response.choices[0].message.content.strip()
        print("Ответ LLM:", content)
        return content

    except Exception as e:
        print("Ошибка в llm_refine_query:", e)
        return "платье хлопок"


if __name__ == "__main__":
    # Тестовые параметры
    llm_refine_query(
        user_input="платье",
        size="M",
        material="хлопок",
        style="кэжуал",
        color_type="теплый",
        body_shape="песочные часы"
    )
