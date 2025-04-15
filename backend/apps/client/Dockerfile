FROM node:20-alpine

LABEL maintainer="Ahmed Ashraf"
LABEL version="1.0"
LABEL description="Dockerfile to run the client app"
LABEL usage="docker build -t <image-name> ."
LABEL usage="docker run -p 8000:8000 <client-image-name>"

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/
RUN apk --no-cache --virtual build-dependencies add libstdc++ binutils-gold curl g++ gcc gnupg libgcc linux-headers make python3 
RUN npm install --quiet node-gyp node-pre-gyp -g 
RUN yarn install --ignore-engines --pure-lockfile --non-interactive 
RUN apk del build-dependencies


COPY ./ ./

RUN yarn run build client

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "run", "start", "client"]
