FROM node:14.18.2-stretch

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile && \
    yarn global add local-web-server

# Map arguments to react-scripts env variables
ARG REACT_APP_ENV
ARG REACT_APP_BASE_URL
ARG REACT_APP_BASE_HOST
ARG REACT_APP_METABASE_URL
ARG REACT_APP_METABASE_SECRET_KEY
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_BASE_HOST=$REACT_APP_BASE_HOST
ENV REACT_APP_METABASE_URL=$REACT_APP_METABASE_URL
ENV REACT_APP_METABASE_SECRET_KEY=$REACT_APP_METABASE_SECRET_KEY

# Build site
SHELL ["bash", "-c"]
COPY . ./
RUN if [[ "$REACT_APP_ENV" == "dev" ]] ; then \
      echo "[WARNING] Site has not been built. You must start this container with command 'yarn start'" ; \
    else \
      INLINE_RUNTIME_CHUNK=false yarn build && mv /app/build /site ; \
    fi

EXPOSE 3000
CMD ws --port 3000 -d /site --log.format dev --spa index.html
