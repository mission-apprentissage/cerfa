#!/bin/sh
# vim:sw=2:ts=2:sts=2:et

set -eu

DNS_SERVER="${DNS_SERVER:-$(grep -i '^nameserver' /etc/resolv.conf | head -n1 | cut -d ' ' -f2)}"
RESOLVER_DIRECTIVE="resolver ${DNS_SERVER} ipv6=off valid=5s;"

sed -i.bak "/http {/a ${RESOLVER_DIRECTIVE}" /etc/nginx/nginx.conf
sed -i.bak "s/include includes\/location_common.conf;/include includes\/location_common.conf;\ninclude \/etc\/nginx\/conf.d\/ws.inc;/g" /etc/nginx/conf.d/default.conf
# sed -i.bak "s/ssl_dhparam \/etc\/ssl\/certs\/dhparam-2048.pem;/ssl_dhparam \/ssl\/ssl-dhparams.pem;/g" /etc/nginx/conf.d/default.conf

cat /etc/nginx/nginx.conf
cat /etc/nginx/conf.d/default.conf

