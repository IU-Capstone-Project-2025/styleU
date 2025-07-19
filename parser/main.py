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

COLOR_IDS = {
    "бежевый": 16119260,
    "голубой": 11393254,
    "жёлтый": 16776960,
    "белый": 16777215,
    "чёрный": 0,
    "коричневый": 10824234,
    "оранжевый": 16753920,
    "розовый": 16761035,
    "зелёный": 3_327_680,
    "красный": 16_711_680,
    "серый": 8_421_504,
    "синий": 255,
    "фиолетовый": 15_631_086
}

MATERIAL_IDS = {
    "акрил": 15000418,
    "вискоза": 15000820,
    "джинса": 15015099,
    "замша": 15000485,
    "лен": 15000909,
    "полиэстер": 31468069,
    "хлопок": 15000517,
    "шерсть": 15000911,
    "эластан": 15001448,
    "бархат":15028957,
    "вельвет":32031531,
    "велюр":46748907,
    "искуственная кожа":15000417,
    "натуральная кожа":15001662,
    "нейлон":15026431,
    "шелк искусственный":15001833,
    "шелк натуральный":15000413,
    "шифон":15028957,
    "штапель":15000583,
    "экокожа":15046579

}

SIZE_IDS = {
    "38":-1000000191,
    "40": -1000000192,
    "42": -1000000193,
    "44": -1000000194,
    "46": -1000000195,
    "48": -1000000196,
    "50": -1000000197,
    "52": -1000000198,
    "54": -1000000199
}

GENDER_FILTERS = {
    "женский": "2",
    "мужской": "1",
    "девочка": "5",
    "мальчик": "6",
    "детский": "3"
}

# Deepseek API key
client = Together(api_key="d6c15ee0b57f97707f05b2661455333de5db0666fcd25b4cfdb2832e55648d27")

# LLM generating query for search
def llm_refine_query(user_input: str, size: str, price_min: str, price_max: str, extra_info: str, sex: str, style: str, color_type: str, body_shape: str) -> list:
    prompt = (
        f"Пользователь хочет образ: {user_input}\n"
        f"Убедись, что аксессуары соответствуют событию и полу, упомянутым в запросе пользователя. Например, если пользователь просит 'женское платье на выпускной', аксессуары должны быть женскими и подходить для выпускного.\n"
        f"... Убедись, что цвет из запроса пользователя (если он есть) включен в поле query каждой вещи."
        f"Размер: {size}, Цена: {price_min}-{price_max}, Дополнительная информация: {extra_info}, Пол: {sex},Стиль: {style}, Цветотип: {color_type}, Фигура: {body_shape}\n\n"
        f"Собери **3 разных полноценных образа** (варианта луков) для пользователя, где ГЛАВНЫЙ предмет (платье/костюм) должен быть ИСКЛЮЧИТЕЛЬНО из {extra_info}.. Каждый образ должен быть JSON-объектом с полями:\n"
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
                        "3) включай обязательно всегда материал, 4) не упоминай напрямую фигуру или цветотип, "
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
    
from urllib.parse import quote_plus


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

# Сборка ссылки на WB по запросу и фильтрам
def build_wb_search_link(query: str, size: str,sex: str, price_min: str, price_max: str, is_main=False, color="", material="") -> str:
    base_url = "https://www.wildberries.ru/catalog/0/search.aspx?"

    params = {
        "search": query,
        "sort": "popular"
    }

    if price_min and price_max:
        try:
            min_p = int(price_min) * 100
            max_p = int(price_max) * 100
            params["priceU"] = f"{min_p};{max_p}"
        except ValueError:
            print("Ошибка преобразования цены")

    if is_main and size in SIZE_IDS:
        params["f1000000006"] = SIZE_IDS[size]

    if sex and sex.lower() in GENDER_FILTERS:
            params["fkind"] = GENDER_FILTERS[sex.lower()]  

    # Заккоментировано, так как в запросе уже есть цвет
    # if color in COLOR_IDS:
    #     params["fcolor"] = COLOR_IDS[color]
    

    if is_main and material in MATERIAL_IDS:
        params["f14177450"] = MATERIAL_IDS[material]

    return base_url + "&".join(f"{key}={quote_plus(str(value))}" for key, value in params.items())



from urllib.parse import unquote_plus
from urllib.parse import urlparse, parse_qs
from urllib.parse import unquote_plus, urlparse, parse_qs, urlencode, urlunparse

# Функция для извлечения текста запроса и фильтров
def parse_wb_url(wb_url):
    parsed = urlparse(wb_url)
    query_dict = parse_qs(parsed.query)

    search_text = unquote_plus(query_dict.get("search", [""])[0])

    # Извлекаем фильтры (в виде словаря)
    filters = {}
    for key, value in query_dict.items():
        if key.startswith("f") or key == "priceU":
            filters[key] = value[0]

    return search_text, filters

# Запрос к WB API и извлечение первого продукта с его информацией
import httpx
import time
async def get_first_product_info(wb_url: str):
    try:
        search_text, filters = parse_wb_url(wb_url)
        url = "https://search.wb.ru/exactmatch/ru/common/v5/search"

        params = {
            'appType': '1',
            'curr': 'rub',
            'dest': '-1257786',
            'query': search_text,
            'resultset': 'catalog',
            'sort': 'popular',
            'spp': '30',
            'uclusters': '0',
            'page': 1
        }
        
        
        params.update(filters)

        headers = {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
        }

        print("Запрос к WB API:", url)
        print("Параметры запроса:", params)

        start_time = time.perf_counter()
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
        duration = time.perf_counter() - start_time
        print(f"⏱️ Время запроса к WB API: {duration:.2f} секунд")

        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            print(f"Ошибка запроса: {response.status_code}")
            return None

        print("Код ответа WB API:", response.status_code)
        print("Текст ответа:", response.text[:1000])  

        try:
            data = response.json()
        except json.JSONDecodeError:
            print("Ошибка парсинга JSON")
            return None

        products = data.get('data', {}).get('products', [])
        if not products:
            print("Нет продуктов в ответе.")
            return {"link": wb_url, "image": "", "price": ""}

        # Извлекаем первый продукт и извлекаем его цену  и ссылку и картинку
        product = products[0]
        price = extract_price(product)
        if price is None:
            print("Не удалось извлечь цену из продукта.")
            return {"link": wb_url, "image": "", "price": ""}

        return {
            "link": f"https://www.wildberries.ru/catalog/{product.get('id')}/detail.aspx",
            "image": build_wb_image_url(product.get('id')),
            "price": str(price)
        }

    except Exception as e:
        print("❌ Ошибка при запросе get_first_product_info:", e)
        return {"link": wb_url, "image": "", "price": ""}

# Функция для извлечения цвета и материала
def extract_color_material(extra_info: str):
    words = extra_info.lower().split()
    found_color = next((w for w in words if w in COLOR_IDS), "")
    found_material = next((w for w in words if w in MATERIAL_IDS), "")
    return found_color, found_material

from fastapi.responses import JSONResponse

@app.post("/parser", response_class=JSONResponse)
async def search(
    request: Request,
    query: str = Form(...),
    size: str = Form(...),
    price_min: str = Form(...),
    price_max: str = Form(...),
    extra_info: str = Form(...),
    sex: str = Form(...),
    style: str = Form(...),
    color_type: str = Form(...),
    body_shape: str = Form(...)
):
     # заглушка
    # sex = "мужской"
    # style = "повседневный"
    # color_type = "весна"
    # body_shape = "прямоугольник"

    print(f" Запрос пользователя: {query}")
    print(f"Размер: {size}, Дополнительная информация: {extra_info}, Пол: {sex}, Стиль: {style}, Цветотип: {color_type}, Фигура: {body_shape}")

    outfit_variants = llm_refine_query(query, size, price_min, price_max, extra_info, sex, style, color_type, body_shape)

    print(" Результат от LLM:")
    print(json.dumps(outfit_variants, ensure_ascii=False, indent=2))

    outfits = []

    found_color, found_material = extract_color_material(extra_info)

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

        has_main = False

        for item in outfit.get("items", []):
            if not isinstance(item, dict):
                continue

            item_query = item.get("query", "")
            category = item.get("category", "")
            item_type = item.get("item", "Товар")

            # Только один раз применим фильтр размера — если категория главная
            is_main = False
            if not has_main and category:
                is_main = True
                has_main = True

            wb_url = build_wb_search_link(
                query=item_query,
                size=size,
                sex=sex,
                price_min=price_min,
                price_max=price_max,
                is_main=is_main,
                color=found_color,
                material=found_material
            )
            product = await get_first_product_info(wb_url)

            complete_look["items"].append({
                "image": product["image"],
                "link": product["link"],
                "price": product["price"],
                "marketplace": "Wildberries",
                "reason": f"{item_type}: {item_query}"
            })


        if complete_look["items"]:
            outfits.append(complete_look)

    return {"outfits": outfits}
