FROM node:12.16.1-stretch

RUN apt update && apt install -y certbot curl
RUN yarn global add serve

RUN mkdir -p /etc/letsencrypt

COPY app/entrypoint.sh /
RUN chmod +x /entrypoint.sh

VOLUME /etc/letsencrypt
EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
