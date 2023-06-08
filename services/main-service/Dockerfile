# syntax=docker/dockerfile:1

FROM node:18.16.0-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./

RUN "npm install --omit=dev"

COPY ./build .

# check files list
RUN ls -a

CMD ["node", "services/main-service/src/index.js"]

