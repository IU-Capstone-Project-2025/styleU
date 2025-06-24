# AI-Powered Stylist - StyleU

An intelligent stylist that provides **personalized outfit suggestions** based on user input.  
Designed to help users make confident fashion choices using AI technology.

## 👩🏼‍💻 Features

-  Detects user’s **color type** from a photo  
-  Identifies **body type** based on measurements  
-  Suggests real products from marketplaces like **Wildberries** and **Ozon**

To start the service, run:

```bash
make run
```
To start the ML service, run:
```
cd ml-service
uvicorn app.main:app --reload --port 8000
```
To start LLM service, create .env file and paste the key:
```
cp .env.example .env
```
And then run:
```
cd llm-service
uvicorn app.main:app --reload --port 8001
```
