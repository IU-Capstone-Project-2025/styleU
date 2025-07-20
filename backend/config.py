import os
from dotenv import load_dotenv

load_dotenv()

# PREDICT_BODY_TYPE_ML_URL = "http://host.docker.internal:8000/predict"
# PREDICT_BODY_TYPE_LLM_URL = "http://host.docker.internal:8001/recommend"

# PREDICT_COLOR_TYPE_URL = "http://host.docker.internal:8000/predict_color_type"
# PREDICT_COLOR_TYPE_LLM_URL = "http://host.docker.internal:8001/recommend_by_color_type"

PREDICT_BODY_TYPE_ML_URL = "http://ml:8000/predict"
PREDICT_BODY_TYPE_LLM_URL = "http://llm:8001/recommend"

PREDICT_COLOR_TYPE_URL = "http://ml:8000/predict_color_type"
PREDICT_COLOR_TYPE_LLM_URL = "http://llm:8001/recommend_by_color_type"

PARSER_URL = "http://parser:8002/parser"

GENERATE_AVATAR_URL = "http://ml:8000/generate-avatar_leonardo"

DATABASE_URL=f"postgresql+asyncpg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@db:5432/{os.getenv('POSTGRES_DB')}"
MONGO_URL="mongodb://mongo:27017"
SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_DB = os.getenv("MONGO_DB")
