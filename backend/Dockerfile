FROM python:3.11-slim

COPY ./backend ./backend

RUN pip install --no-cache-dir -r ./backend/requirements.txt

# RUN alembic upgrade head

CMD ["python", "./backend/main.py"]
