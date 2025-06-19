import requests

res = requests.post("http://localhost:8001/recommend", json={"body_type": "груша"})
print(res.json())
