FROM node:14.15.3-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile && \
    yarn global add local-web-server

# Build site
COPY . ./
RUN INLINE_RUNTIME_CHUNK=false yarn build && \
    mv /app/build /site

EXPOSE 3000
CMD ws --port 3000 -d /site --log.format dev --spa index.html
