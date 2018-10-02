FROM node:10-alpine

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ENV DB_PATH /db/chat_app.db
ENV PORT 8081
EXPOSE ${PORT}
CMD ["npm", "start"]

