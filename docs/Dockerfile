FROM node:18-alpine

WORKDIR /app

COPY ./docs/package*.json ./

RUN npm install

COPY ./docs .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]