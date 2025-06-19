import httpx

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"

async def get_response_from_ollama(prompt: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        })
        response.raise_for_status()
        return response.json()["response"]
