FROM node:11.15.0-alpine

COPY . .

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh pkgconfig autoconf automake libtool nasm build-base zlib-dev

RUN npm install

RUN npm run build

EXPOSE 3020

ENTRYPOINT npm run serve:prod