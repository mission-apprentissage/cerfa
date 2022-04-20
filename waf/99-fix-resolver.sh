#!/bin/sh
# vim:sw=2:ts=2:sts=2:et

set -eu

DNS_SERVER="${DNS_SERVER:-$(grep -i '^nameserver' /etc/resolv.conf | head -n1 | cut -d ' ' -f2)}"
RESOLVER_DIRECTIVE="resolver ${DNS_SERVER} ipv6=off valid=5s;"

sed -i.bak "/http {/a ${RESOLVER_DIRECTIVE}" /etc/nginx/nginx.conf