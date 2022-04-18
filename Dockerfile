FROM node:17-alpine3.14

WORKDIR /backend

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chmod +x wait-for

RUN npm run build

CMD npm run start