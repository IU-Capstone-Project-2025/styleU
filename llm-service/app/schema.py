from pydantic import BaseModel

class LLMRequest(BaseModel):
    body_type: str  # Пример: "груша", "яблоко", "песочные часы"

class LLMResponse(BaseModel):
    recommendation: str
