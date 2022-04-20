location /_next {
    proxy_pass          http://ui:3000;
    
    proxy_redirect          off;
    proxy_cache             off;

    proxy_http_version  1.1;
    proxy_set_header    Upgrade $http_upgrade;
    proxy_set_header    Connection "Upgrade";
    proxy_set_header    Host $host;
}

location /sockjs-node {
    proxy_pass          http://ui:3000;
    proxy_http_version  1.1;
    proxy_set_header    Upgrade $http_upgrade;
    proxy_set_header    Connection "Upgrade";
    proxy_set_header    Host $host;
}

    