FROM node:16-bullseye

RUN apt-get update \
    && apt-get install -y graphicsmagick

#Install and cache node_modules
COPY package.json yarn.lock /tmp/
RUN cd /tmp && \
    yarn install --frozen-lockfile && \
    mkdir -p /app && \
    mv /tmp/node_modules /app/

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

WORKDIR /app
COPY --chown=expressjs:nodejs ./ /app

USER expressjs

VOLUME /data
EXPOSE 5000
CMD ["yarn", "start"]
