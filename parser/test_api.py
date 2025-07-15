import requests
import json

url = "https://search.wb.ru/exactmatch/ru/common/v5/search"
params = {
    'appType': '1',
    'curr': 'rub',
    'dest': '-1257786',
    'query': 'колье серебристое минимализм',
    'resultset': 'catalog',
    'sort': 'popular',
    'spp': '30',
    'uclusters': '0',
    'page': 0
}
headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json"
}

response = requests.get(url, params=params, headers=headers)
data = response.json()

print(json.dumps(data, ensure_ascii=False, indent=2))

products = data.get('data', {}).get('products', [])
print(f"Найдено товаров: {len(products)}")

if products:
    product = products[0]
    print("Пример первого товара:")
    print(f"Название: {product.get('name')}")
    print(f"Рейтинг: {product.get('rating')}")
    print(f"Размеры: {[s['name'] for s in product.get('sizes', [])]}")
else:
    print("Товары не найдены")
