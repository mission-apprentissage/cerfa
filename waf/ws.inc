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

location /smtp {
    proxy_pass          http://smtp:8025;

    # Websocket configuration
    # See:
    #  - https://www.nginx.com/blog/websocket-nginx/
    #  - https://github.com/mailhog/MailHog/issues/117
    proxy_http_version  1.1;
    proxy_set_header    Upgrade $http_upgrade;
    proxy_set_header    Connection $connection_upgrade;
}

location /socket.io {
    proxy_http_version  1.1;
    proxy_set_header    Upgrade $http_upgrade;
    proxy_set_header    Connection "upgrade";

    proxy_pass              http://server:5000;
    proxy_redirect          off;
    proxy_cache             off;
    proxy_set_header        Host $host;
    proxy_set_header        X-Real-IP $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Host $server_name;
    proxy_set_header        X-Forwarded-Proto $scheme;

 }