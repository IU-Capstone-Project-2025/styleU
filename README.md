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

to run model you need to download llm model:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull mistral
```

back & fron work after:

```bash
make run
```

to run ml service:

```bash
cd ml-service
uvicorn app.main:app --reload --port 8000
```

to run llm service:

```bash
cd llm-service
uvicorn app.main:app --reload --port 8001
```
