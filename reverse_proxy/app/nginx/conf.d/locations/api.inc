location /api {
    limit_req               zone=flood burst=100 nodelay;
    include /etc/nginx/conf.d/locations/fragments/proxy_api.inc;
 }
