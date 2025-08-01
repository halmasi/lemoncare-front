# Use a valid Node.js image
FROM node:22.11.0-alpine

WORKDIR /usr/src/app

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
