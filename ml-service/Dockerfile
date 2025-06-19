FROM python:3.11-alpine

WORKDIR /app

COPY ./ml-service/ .

COPY ./ml-service/requirements.txt ./requirements.txt

RUN apk add --no-cache \
        build-base \
        gcc \
        g++ \
        musl-dev \
        python3-dev \
        libffi-dev \
        openssl-dev \
        bash \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
