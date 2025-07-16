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
    "хлопок": ["хлопок", "cotton", "100% хлопка", "хлопковый", "коттон"],
    "лен": ["лён", "льняной", "linen"],
    "шерсть": ["шерсть", "шерстяной", "wool", "woolen"],
    "вискоза": ["вискоза", "вискозный", "viscose"],
    "полиэстер": ["полиэстер", "полиэстровый", "polyester"],
    "шелк": ["шёлк", "шелк", "шелковый", "silk"],
    "джинса": ["джинса", "деним", "джинсовый", "denim"],
    "трикотаж": ["трикотаж", "трикотажный", "knit", "jersey"],
    "кожа": ["кожа", "кожаный", "leather"],
    "эко-кожа": ["эко-кожа", "экокожа", "искусственная кожа", "eco-leather", "faux leather"],
    "замша": ["замша", "замшевый", "suede"],
    "акрил": ["акрил", "акриловый", "acrylic"],
    "нейлон": ["нейлон", "нейлоновый", "nylon"],
    "эластан": ["эластан", "spandex", "elastane"],
    "лайкра": ["лайкра", "lycra"],
    "мех": ["мех", "меховой", "fur", "искусственный мех", "натуральный мех"],
}


COLOR_SYNONYMS = {
    "белый": ["белый", "молочный", "айвори", "экрю", "слоновая кость"],
    "черный": ["чёрный", "черный", "графит", "антрацит", "смоль"],
    "красный": ["красный", "бордовый", "алый", "вишнёвый", "терракотовый"],
    "синий": ["синий", "тёмно-синий", "голубой", "индиго", "васильковый", "лазурный", "джинсовый"],
    "зелёный": ["зелёный", "оливковый", "хаки", "мятный", "салатовый", "изумрудный", "лайм"],
    "розовый": ["розовый", "пудровый", "коралловый", "фуксия", "неоново-розовый"],
    "бежевый": ["бежевый", "нюд", "песочный", "карамельный", "какао", "кафе латте"],
    "серый": ["серый", "пепельный", "графитовый", "стальной"],
    "желтый": ["жёлтый", "горчичный", "соломенный", "лимонный", "золотой"],
    "оранжевый": ["оранжевый", "янтарный", "мандариновый", "персиковый"],
    "фиолетовый": ["фиолетовый", "лавандовый", "баклажан", "лиловый", "сиреневый"],
    "коричневый": ["коричневый", "шоколадный", "кофейный", "каштановый", "бронзовый"],
    "серебристый": ["серебристый", "металлик", "серебро", "silver"],
    "золотой": ["золотой", "gold", "золотистый", "metallic", "металлик"],
}


# Deepseek API key
client = Together(api_key="d6c15ee0b57f97707f05b2661455333de5db0666fcd25b4cfdb2832e55648d27")

# LLM generating query for search
def llm_refine_query(user_input: str, size: str, price_min: str, price_max: str, extra_info: str, style: str, color_type: str, body_shape: str) -> list:
    prompt = (
        f"Пользователь хочет образ: {user_input}\n"
        f"... Убедись, что цвет из запроса пользователя (если он есть) включен в поле query каждой вещи."
        f"Размер: {size}, Цена: {price_min}-{price_max}, Дополнительная информация: {extra_info}, Стиль: {style}, Цветотип: {color_type}, Фигура: {body_shape}\n\n"
        f"Собери **3 разных полноценных образа** (варианта луков) для пользователя. Каждый образ должен быть JSON-объектом с полями:\n"
        f"- items: список вещей (3-6 элементов)\n"
        f"- totalReason: пояснение почему лук хорош для пользователя с его параметрами (форма тела и цветотип)\n"
        f"- totalReason_en: an explanation of why a bow is good for a user with its parameters (body shape and color type)\n"
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
        f"    \"totalReason\": \"Образ идеально подходит для мусульманок\",\n"
        f"    \"totalReason_en\": \"The bow is perfect for muslims\"\n"
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
                        "Учитывай: 0) Всегда возвращай JSON строго в блоке ```json ... ```,1) фасон вещи должен соответствовать фигуре, 2) оттенки цвета — цветотипу, "
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

        try:
            json_match = re.search(r"```json\s*(\[.*?\])\s*```", raw_content, re.DOTALL)
            if json_match:
                json_block = json_match.group(1)
            else:
                # Пробуем достать JSON даже без ```json
                json_block = re.search(r"(\[\s*{.*?}\s*\])", raw_content, re.DOTALL).group(1)
            
            content = json.loads(json_block)
            print("Answer of LLM:", content)
            return content

        except Exception as e:
            print("Error in llm_refine_query:", e)
            return [[{"item": "платье", "query": "платье на выпускной", "category": "main"}]]


    except Exception as e:
        print("Error in llm_refine_query:", e)
        return [[{"item": "платье", "query": "платье на выпускной", "category": "main"}]]


# Check if product matches user material and styel preferences
def matches_style(description, value, synonym_dict):
    synonyms = synonym_dict.get(value.lower(), [value.lower()])
    return any(syn in description.lower() for syn in synonyms)

# Check if product has user extra info
def matches_extra_info(description: str, extra_info: str) -> bool:
    description = description.lower()
    words = extra_info.lower().split()

    combined_synonyms = {}
    combined_synonyms.update(MATERIAL_SYNONYMS)
    combined_synonyms.update(COLOR_SYNONYMS)

    for word in words:
        synonyms = combined_synonyms.get(word, [word])
        if any(syn in description for syn in synonyms):
            return True
    return False


# Check if product has user size
def size_matches(size_filter, sizes):
    size_filter = size_filter.upper()
    for s in sizes:
        s = s.upper()
        if size_filter == s:
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

def match_query_words(product_name: str, query: str) -> bool:
    name_words = set(product_name.lower().split())
    query_words = set(query.lower().split())
    return bool(name_words & query_words)  # есть хотя бы одно общее слово

def extract_price(product: dict) -> int | None:
    try:
        prices = []
        for size in product.get("sizes", []):
            if size.get("price", {}).get("product"):
                prices.append(size["price"]["product"])
        
        if not prices:
            return None
            
        min_price = min(prices) // 100
        return min_price if min_price > 0 else None
    except Exception as e:
        print(f"Ошибка извлечения цены: {e}")
        return None



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
def get_products(search_query: str, size_filter: str, extra_info_filter: str, style_filter: str, category: str = "" ,min_price=None, max_price=None):
        # Приведение типов
    try:
        min_price = int(min_price) if min_price else None
    except:
        min_price = None

    try:
        max_price = int(max_price) if max_price else None
    except:
        max_price = None

    max_pages = 5
    all_products = []
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "application/json"
}

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

        url = "https://search.wb.ru/exactmatch/ru/common/v5/search"
        try:
            response = requests.get(url, params=params, headers=headers)
            data = response.json()
            print(f"📨 Ответ от WB (стр. {page+1}):", json.dumps(data, ensure_ascii=False, indent=2))
        except Exception as e:
            print("❌ Ошибка запроса:", e)
            continue
        
        products = data.get('data', {}).get('products', [])

        for product in products:
            sizes = [s['name'] for s in product.get('sizes', []) if 'name' in s]
            description = product.get('name', '').lower()

            if not match_query_words(description, search_query):
                continue

            if category == "main":
               if not (size_matches(size_filter, sizes) or matches_extra_info(description, extra_info_filter) or matches_style(description, style_filter, STYLE_KEYWORDS)):
                    continue

            rating = float(product.get("reviewRating", 0))
            feedbacks = int(product.get("feedbacks", 0))

            if feedbacks < 5:
                continue

            score = rating * math.log1p(feedbacks)

             # Получаем цену товара
            price = extract_price(product)
            if price is None:
                continue  # Пропускаем если не удалось получить цену

            if min_price or max_price:
                price = extract_price(product)
                if price:
                    if min_price and price < min_price:
                        continue
                    if max_price and price > max_price:
                        continue
            
                product_data = {
                    'title': product.get('name', ''),
                    'price': extract_price(product) or 0,  
                    'image': build_wb_image_url(product.get('id', 0)),
                    'link': f"https://www.wildberries.ru/catalog/{product.get('id', '')}/detail.aspx",
                    'sizes': sizes,
                    'rating': rating,
                    'feedbacks': feedbacks,
                    'score': score
                }
                if product_data['price'] is not None: 
                    all_products.append(product_data)


    # Взвешенная оценка: количество отзывов * рейтинг
    all_products.sort(key=lambda x: x['score'], reverse=True)


    return all_products[:15]  # Возвращаем топ-15 отсортированных

from fastapi.responses import JSONResponse

# Define FastAPI app
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "products": None})

@app.post("/parser", response_class=JSONResponse)
async def search(
        request: Request,
        query: str = Form(...),
        size: str = Form(...),
        price_min: str = Form(...),
        price_max: str = Form(...),
        extra_info: str = Form(...),
        # style: str = Form(...),
        # color_type: str = Form(...),
        # body_shape: str = Form(...),
):
    # заглушка
    style = "повседневный"
    color_type = "весна"
    body_shape = "прямоугольник"

    print(f" Запрос пользователя: {query}")
    print(f"Размер: {size}, Дополнительная информация: {extra_info}, Стиль: {style}, Цветотип: {color_type}, Фигура: {body_shape}")

    outfit_variants = llm_refine_query(query, size,price_min, price_max, extra_info, style, color_type, body_shape)

    print(" Результат от LLM:")
    print(json.dumps(outfit_variants, ensure_ascii=False, indent=2))

    outfits = []

    def shorten_query(query: str, max_words: int = 3) -> str:
        return " ".join(query.split()[:max_words])

    for idx, outfit in enumerate(outfit_variants):

        if not isinstance(outfit, dict):
            continue

        complete_look = {
            "items": [],
            "totalReason": outfit.get("totalReason", "Образ составлен с учетом всех параметров"),
            "totalReason_en": outfit.get("totalReason_en", "The outfit is composed with all parameters"),
        }

        for item_idx, item in enumerate(outfit.get("items", [])):

            if not isinstance(item, dict):
                continue

            query = item.get("query", "")
            category = item.get("category", "")

            products = get_products(query, size, extra_info, style, category,  price_min, price_max)

            # 🔁 fallback: упрощение запроса при отсутствии результатов
            if not products and " " in query:
                simplified_query = shorten_query(query)
                products = get_products(simplified_query, size, extra_info, style, category, price_min, price_max)


            if products:
                best_product = max(products, key=lambda x: x['rating'])

                complete_look["items"].append({
                    "image": best_product["image"],
                    "link": best_product["link"],
                    "price": best_product["price"],
                    "marketplace": "Wildberries",
                    "reason": f"{item.get('item', 'Товар')}: {best_product['title']} (рейтинг: {best_product['rating']})"
                })

        if complete_look["items"]:
            outfits.append(complete_look) 

    return {"outfits": outfits}
