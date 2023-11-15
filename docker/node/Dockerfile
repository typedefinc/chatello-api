FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn

COPY prisma ./prisma/

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD yarn run build && yarn run start
