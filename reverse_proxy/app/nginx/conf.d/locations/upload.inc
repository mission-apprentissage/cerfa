location /api/v1/upload {
    limit_req               zone=flood burst=100 nodelay;
    client_max_body_size    50M;
    include /etc/nginx/conf.d/locations/fragments/proxy_api.inc;
}
