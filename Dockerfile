FROM node:12-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PORT 3000
ENV DATA_DIR /data
ENV CHROMIUM_PATH /usr/bin/chromium-browser

WORKDIR /usr/src/app

# Install Chromium
RUN apk update && apk upgrade && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk add --no-cache \
  chromium@edge \
  nss@edge

# Install actual application
COPY package*.json ./

# https://github.com/typicode/husky/issues/822
ENV HUSKY_SKIP_INSTALL true

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Define before start script, otherwise NPM ignores dev dependencies
ENV NODE_ENV production
# Unfortunately, Chromium inside Docker has issues, even when running as a non-default user.
ENV DISABLE_CHROMIUM_SANDBOX true

CMD ["npm", "start"]
