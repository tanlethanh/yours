# syntax=docker/dockerfile:1

FROM node:19-alpine

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install 

RUN npm install typescript

COPY . .

# check files list
RUN ls -a

RUN npm run build

CMD ["npm", "start"]

