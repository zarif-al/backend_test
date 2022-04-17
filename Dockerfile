FROM node:17-alpine3.14

WORKDIR /backend

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

ENV PORT=8080

EXPOSE 8080

CMD npm run start