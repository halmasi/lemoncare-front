# Use a valid Node.js image
FROM node:22.11.0-alpine

WORKDIR /usr/src/app

COPY ./package*.json .

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
