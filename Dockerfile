FROM node:17-alpine3.14

WORKDIR /backend-test

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=8080

EXPOSE 8080

CMD npm run start