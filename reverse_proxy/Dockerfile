FROM owasp/modsecurity-crs:3.3.2-nginx

ARG CERFA_ENV

RUN apt-get update \
    && apt-get install -y logrotate

#Logrotate
COPY app/logrotate.d/logrotate.conf /etc/logrotate.conf
RUN chmod 644 /etc/logrotate.conf

#Nginx
COPY app/nginx /etc/nginx

VOLUME /data

