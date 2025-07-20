# AI-Powered Stylist - StyleU

An intelligent stylist that provides **personalized outfit suggestions** based on user input.  
Designed to help users make confident fashion choices using AI technology.

**[deployed app](http://94.228.169.104:5173)**

## Launching the application
To launch the application, start Docker and run the following commands in the project root:

```bash
docker-compose down -v --remove-orphans
docker system prune -a 
docker-compose up
```

Six containers will be launched in Docker:

- Frontend

- Backend

- ML

- LLM

- Parser

Databases:

- PostgreSQL

- MongoDB


## interaction with the interface

To interact with the web application, go to: http://localhost:5173

Two languages are available: **Russian** and **English**
You can switch between them at the bottom of the interface.

Currently, 3 main features are implemented + user registration:
### Color Type Analysis

1. Upload a photo taken in natural lighting

2. Click Analyze

3. Wait a few seconds — the app will analyze your color type and generate style recommendations

4. Once the process is complete, you will see:

    Your color type

    Personalized recommendations

🔒 If the user is logged in, the data is saved to the database and used later when generating outfits

<u>How it works inside:</u>

1. The frontend sends the photo to the backend

2. The backend sends it to the ML service

3. The ML service returns the color type

4. The backend sends the color type + photo to the LLM service

5. The LLM service generates a prompt and returns color-based style recommendations

6. The backend returns all data to the frontend, which displays it in the interface

## Body Type Analysis

1. Enter your body measurements and select your gender

2. Click Analyze

3. Wait a few seconds — your body type will be identified, and style suggestions will be generated

4. Once complete, you'll see your body type and recommendations

🔒 If the user is logged in, the data is saved and used in outfit generation

<u>How it works under the hood:</u>

1. The frontend sends the parameters to the backend

2. The backend calculates the body type using a formula

3. The body type and parameters are sent to the LLM

4. The LLM generates a prompt and returns recommendations

5. The backend passes the data to the frontend, which displays it

## Outfit Generation Based on User Request

⚠️ Available only for logged-in users

1. Enter:

    The type of outfit you want

    Your price range

    Your usual clothing size

    Any additional details

2. Click Search

3. Wait 30–60 seconds — the outfit will be generated and searched for

4. Once complete, you’ll see 3 suggested outfits with:

    Clickable images linking to the marketplace

    Option to add to favorites

<u>How it works under the hood:</u>

1. The frontend sends the user request to the backend

2. The user's color type and body parameters are added

3. The data is sent to the Parser

4. The parser creates a prompt to generate the outfit components (e.g., "black silk dress, silver heels")

5. For each of the 3 outfits, the necessary items are searched on Wildberries with appropriate filters

6. The backend receives the results and sends them to the frontend for display

## Registration

The registration and login process uses token-based authentication (JWT)
