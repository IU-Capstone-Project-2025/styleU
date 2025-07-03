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


DATABASE_URL="postgresql+asyncpg://styleu_user:password@db:5432/styleu"
SECRET_KEY = os.getenv("SECRET_KEY")
