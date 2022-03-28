FROM nginx:1.21.4

ARG CERFA_ENV

RUN apt-get update \
    && apt-get install -y logrotate nginx-extras

#Logrotate
COPY app/logrotate.d/logrotate.conf /etc/logrotate.conf
RUN chmod 644 /etc/logrotate.conf

#Nginx
COPY app/nginx /etc/nginx
COPY app/start.sh /opt/nginx/start.sh
RUN chmod +x /opt/nginx/start.sh

SHELL ["bash", "-c"]
RUN if [[ "$CERFA_ENV" == "dev" ]] ; then \
      rm -f /etc/nginx/conf.d/locations/ui.inc && mv /etc/nginx/conf.d/locations/ui-dev.inc /etc/nginx/conf.d/locations/ui.inc ; \
    else \
        rm -f /etc/nginx/conf.d/locations/ui.inc && mv /etc/nginx/conf.d/locations/ui-production.inc /etc/nginx/conf.d/locations/ui.inc ; \
    fi

VOLUME /data
CMD /opt/nginx/start.sh
