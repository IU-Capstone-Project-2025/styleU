from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import requests
import json
import re
import math
app = FastAPI()
templates = Jinja2Templates(directory="templates")

from together import Together

STYLE_KEYWORDS = {
    "офисный": ["офисная","школьная", "офис", "деловой", "карандаш", "строгий", "классический", "прямой", "формальный"],
    "повседневный": ["повседневный", "удобный", "на каждый день", "повседневка"],
    "спортивный": ["спорт", "трикотаж", "удобный", "активный"],
    "романтичный": ["воздушный", "кружево", "плиссе", "летящий", "нежный", "женственный"],
    "вечерний": ["вечерний", "элегантный", "нарядный", "праздничный", "шикарный"],
    "минимализм":["однотонный", "простой", "минималистичный", "без логотипов", "классика", "old money"]
}
MATERIAL_SYNONYMS = {
    "хлопок": ["хлопок", "cotton", "100% хлопка", "хлопковый"],
    "лен": ["лён", "льняной", "linen"],
    # /// add more
}

COLOR_SYNONYMS = {
    "зелёный": ["зелёный", "оливковый", "хаки", "мятный", "салатовый"],
    "белый": ["белый", "молочный", "айвори", "экрю"],
    # ///
}

# Deepseek API key
client = Together(api_key="d6c15ee0b57f97707f05b2661455333de5db0666fcd25b4cfdb2832e55648d27")

# LLM generating query for search
def llm_refine_query(user_input: str, size: str, material: str, style: str, color_type: str, body_shape: str, color: str) -> list:
    prompt = (
        f"Пользователь хочет образ: {user_input}\n"
        f"Размер: {size}, Цвет: {color}, Материал: {material}, Стиль: {style}, Цветотип: {color_type}, Фигура: {body_shape}\n\n"
        f"Собери **3 разных полноценных образа** (варианта луков) для пользователя. Каждый образ должен быть JSON-объектом с полями:\n"
        f"- items: список вещей (3-6 элементов)\n"
        f"- totalReason: пояснение почему лук хорош для пользователя с его параметрами (форма тела и цветотип)\n"
        f"Каждая вещь должна содержать:\n"
        f"- item: тип вещи (платье, туфли и т.д.)\n"
        f"- query: поисковый запрос для Wildberries (до 7 слов)\n"
        f"- category: категория (main, shoes, bag, accessory)\n\n"
        f"Пример:\n"
        f"[\n"
        f"  {{\n"
        f"    \"items\": [\n"
        f"      {{\"item\": \"платье\", \"query\": \"платье макси молочное хлопок\", \"category\": \"main\"}},\n"
        f"      {{\"item\": \"хиджаб\", \"query\": \"хиджаб молочный хлопковый\", \"category\": \"accessory\"}}\n"
        f"    ],\n"
        f"    \"totalReason\": \"Образ идеально подходит для мусульманок\"\n"
        f"  }}\n"
        f"]"
    )
    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Ты модный ассистент. Подбирай **целые образы** (луки), состоящие из сочетающихся вещей.  "
                        "Учитывай текущие тренды этого года, стиль, фигуру, цветотип."
                        "Убедись, что вещи внутри одного образа подходят друг к другу."
                        "Учитывай: 1) фасон вещи должен соответствовать фигуре, 2) оттенки цвета — цветотипу, "
                        "3) включай материал, 4) не упоминай напрямую фигуру или цветотип, "
                        "а адаптируй фасон и цвет под них, 5) всегда указывай тип вещи (юбка, платье и т.п.)."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            stream=False
        )
        raw_content = response.choices[0].message.content.strip()

        # Ищем JSON внутри текста
        json_match = re.search(r"```json\s*(\[.*?\])\s*```", raw_content, re.DOTALL)

        if not json_match:
            raise ValueError("LLM did not return valid JSON block")

        json_block = json_match.group(1)

        content = json.loads(json_block)
        print("Answer of LLM:", content)
        return content

    except Exception as e:
        print("Error in llm_refine_query:", e)
        return [[{"item": "платье", "query": "платье на выпускной", "category": "main"}]]



# Check if product matches user material and styel preferences
def matches_any(description, value, synonym_dict):
    synonyms = synonym_dict.get(value.lower(), [value.lower()])
    return any(syn in description.lower() for syn in synonyms)


# Check if product has user color
def has_color(product: dict, user_color: str) -> bool:
    if not user_color:
        return True
    synonyms = COLOR_SYNONYMS.get(user_color.lower(), [user_color.lower()])
    for color in product.get("colors", []):
        name = color.get("name", "").lower()
        if any(syn in name for syn in synonyms):
            return True
    return False

# Check if product has user size
def size_matches(size_filter, sizes):
    size_filter = size_filter.upper()
    for s in sizes:
        if size_filter == s.upper():
            return True
        if '-' in s:
            parts = s.split('-')
            try:
                start = int(parts[0])
                end = int(parts[-1])
                size_int = int(size_filter)
                if start <= size_int <= end:
                    return True
            except ValueError:
                continue
    return False


# Build WB image url from product id
def build_wb_image_url(product_id):  
    short_id = product_id // 100000
    part = product_id // 1000
    if 0 <= short_id <= 143:
        basket = '01'
    elif 144 <= short_id <= 287:
        basket = '02'
    elif 288 <= short_id <= 431:
        basket = '03'
    elif 432 <= short_id <= 719:
        basket = '04'
    elif 720 <= short_id <= 1007:
        basket = '05'
    elif 1008 <= short_id <= 1061:
        basket = '06'
    elif 1062 <= short_id <= 1115:
        basket = '07'
    elif 1116 <= short_id <= 1169:
        basket = '08'
    elif 1170 <= short_id <= 1313:
        basket = '09'
    elif 1314 <= short_id <= 1601:
        basket = '10'
    elif 1602 <= short_id <= 1655:
        basket = '11'
    elif 1656 <= short_id <= 1919:
        basket = '12'
    elif 1920 <= short_id <= 2045:
        basket = '13'
    elif 2046 <= short_id <= 2189:
        basket = '14'
    elif 2190 <= short_id <= 2405:
        basket = '15'
    elif 2406 <= short_id <= 2621:
        basket = '16'
    elif 2622 <= short_id <= 2837:
        basket = '17'
    elif 2838 <= short_id <= 3053:
        basket = '18'
    elif 3054 <= short_id <= 3269:
        basket = '19'
    elif 3270 <= short_id <= 3485:
        basket = '20'
    elif 3486 <= short_id <= 3701:
        basket = '21'
    elif 3702 <= short_id <= 3917:
        basket = '22'
    elif 3918 <= short_id <= 4133:
        basket = '23'
    elif 4134 <= short_id <= 4349:
        basket = '24'
    elif 4350 <= short_id <= 4565:
        basket = '25'
    elif 4566 <= short_id <= 4781:
        basket = '26'
    elif 4782 <= short_id <= 5000:
        basket = '27'
    else:
        basket = '28'
    return f"https://basket-{basket}.wbbasket.ru/vol{short_id}/part{part}/{product_id}/images/big/1.webp"


# Get products from WB API and filter by user preferences
def get_products(search_query: str, size_filter: str, material_filter: str, color_filter: str, style_filter: str, category: str = ""):
    max_pages = 5
    all_products = []

    for page in range(max_pages):
        params = {
            'appType': '1',
            'curr': 'rub',
            'dest': '-1257786',
            'query': search_query,
            'resultset': 'catalog',
            'sort': 'popular',
            'spp': '30',
            'uclusters': '0',
            'page': page
        }

        url = "https://search.wb.ru/exactmatch/ru/common/v4/search"
        response = requests.get(url, params=params)
        data = response.json()

        for product in data.get('data', {}).get('products', []):
            sizes = [s['name'] for s in product.get('sizes', []) if 'name' in s]
            description = product.get('name', '').lower()

            if category == "main":
                if not (size_matches(size_filter, sizes) and (
                    matches_any(description, material_filter, MATERIAL_SYNONYMS) or
                    has_color(product, color_filter) or
                    matches_any(description, style_filter, STYLE_KEYWORDS))):
                    continue

            rating = float(product.get("rating", 0))
            feedbacks = int(product.get("feedbacks", 0))
            score = rating * math.log1p(feedbacks)

            all_products.append({
                'title': product['name'],
                'price': product.get('salePriceU', product['priceU']) // 100,
                'image': build_wb_image_url(product['id']),
                'link': f"https://www.wildberries.ru/catalog/{product['id']}/detail.aspx",
                'sizes': sizes,
                'rating': rating,
                'feedbacks': feedbacks,
                'score': score
            })

   
    # Взвешенная оценка: количество отзывов * рейтинг
    all_products.sort(key=lambda x: x['score'], reverse=True)


    return all_products[:15]  # Возвращаем топ-15 отсортированных


# Define FastAPI app
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "products": None})

@app.post("/parser", response_class=HTMLResponse)
async def search(
        request: Request,
        query: str = Form(...),
        size: str = Form(...),
        color: str = Form(...),
        material: str = Form(...),
        style: str = Form(...),
        color_type: str = Form(...),
        body_shape: str = Form(...),
):
    print(f" Запрос пользователя: {query}")
    print(f"Размер: {size}, Цвет: {color}, Материал: {material}, Стиль: {style}, Цветотип: {color_type}, Фигура: {body_shape}")
    
    outfit_variants = llm_refine_query(query, size, material, style, color_type, body_shape, color)

    print(" Результат от LLM:")
    print(json.dumps(outfit_variants, ensure_ascii=False, indent=2))

    outfits = []

    for outfit in outfit_variants:
        if not isinstance(outfit, dict):
            continue
            
        complete_look = {
            "items": [],
            "totalReason": outfit.get("totalReason", "Образ составлен с учетом всех параметров")
        }
        
        has_main = False
        
        for item in outfit.get("items", []):
            if not isinstance(item, dict):
                continue
                
            products = get_products(item.get("query", ""), size, material, color, style, item.get("category", ""))
            if products:
                best_product = max(products, key=lambda x: x['rating'])
                if item.get("category") == "main":
                    has_main = True
                complete_look["items"].append({
                    "image": best_product["image"],
                    "link": best_product["link"],
                    "price": best_product["price"],
                    "marketplace": "Wildberries",
                    "reason": f"{item.get('item', 'Товар')}: {best_product['title']} (рейтинг: {best_product['rating']})"
                })
        
        if complete_look["items"] and has_main:
            outfits.append(complete_look)

    return templates.TemplateResponse("index.html", {"request": request, "outfits": outfits})
