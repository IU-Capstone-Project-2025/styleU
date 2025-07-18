FROM python:3.11-slim

WORKDIR /app

# Копируем содержимое папки parser внутрь /app
COPY ./parser /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8002

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"]
