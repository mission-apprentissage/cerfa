# Install dependencies only when needed
# TODO Should be FROM node:16.14.0-stretch
FROM node:14.18.2-stretch

WORKDIR /app

COPY package.json yarn.lock /app/

# RUN yarn install --frozen-lockfile
RUN yarn install --force

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

COPY . ./

SHELL ["bash", "-c"]
RUN if [[ "$REACT_APP_ENV" == "dev" ]] ; then \
      echo "[WARNING] Site has not been built. You must start this container with command 'yarn start'" ; \
    else \
      yarn build && mv /app/.next /site ; \
    fi

# ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD if [[ "$REACT_APP_ENV" == "dev" ]] ; then \
      yarn dev ; \
    else \
       cp -rf /site/* /app/.next && yarn start ; \
    fi
