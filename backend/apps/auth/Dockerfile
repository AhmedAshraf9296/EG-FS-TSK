FROM node:20-alpine

LABEL maintainer="Ahmed Ashraf"
LABEL version="1.0"
LABEL description="Dockerfile to run 1 nodejs app"
LABEL usage="docker build -t <image-name> ."
LABEL usage="docker run -p 8080:8080 <image-name>"

WORKDIR /usr/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/
RUN apk --no-cache --virtual build-dependencies add libstdc++ binutils-gold curl g++ gcc gnupg libgcc linux-headers make python3 
RUN npm install --quiet node-gyp node-pre-gyp -g 
RUN yarn install --ignore-engines --pure-lockfile --non-interactive 
RUN apk del build-dependencies


COPY ./ ./

RUN yarn run build auth



ENV PORT=3006

EXPOSE 3006

CMD ["yarn", "run", "start", "auth"]
