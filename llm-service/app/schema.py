from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str

class LLMResponse(BaseModel):
    response: str
