location / { 
    limit_req               zone=flood burst=100 nodelay;
    proxy_pass              http://ui:3000;

    proxy_redirect          off;
    proxy_cache             off;

    proxy_set_header        Host $host;
    proxy_set_header        X-Real-IP $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Host $server_name;
    proxy_set_header        X-Forwarded-Proto $scheme; 

    add_header Content-Security-Policy "default-src 'self';frame-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests" always;
    # add_header Content-Security-Policy "default-src 'self' agadir-app.rct01.kleegroup.com;frame-src 'self' agadir-app.rct01.kleegroup.com;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self' agadir-app.rct01.kleegroup.com;img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests" always;

    expires                 $ui_expires;
}
