FROM node:16-alpine as builder
LABEL maintainer="cuong.quang@savvycomsoftware.com"
WORKDIR /temp/app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

CMD npm run start
EXPOSE 3000

