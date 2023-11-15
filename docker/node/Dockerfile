FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --silent

COPY prisma ./prisma/

COPY . .

RUN npm build
RUN npx prisma generate

EXPOSE 3000

CMD npm run start
