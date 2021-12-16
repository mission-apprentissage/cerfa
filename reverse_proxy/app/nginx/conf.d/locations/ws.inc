location /socket.io {
    proxy_http_version  1.1;
    proxy_set_header    Upgrade $http_upgrade;
    proxy_set_header    Connection "upgrade";

    include /etc/nginx/conf.d/locations/fragments/proxy_api.inc;
 }
