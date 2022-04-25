#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

start_app() {
  bash /opt/cerfa/start-app.sh "$(git --git-dir=/opt/cerfa/repository/.git rev-parse --abbrev-ref HEAD)"
}

handle_error() {
  bash /opt/cerfa/tools/send-to-slack.sh "[SSL] Unable to renew certificate"
  start_app
}
trap handle_error ERR

bash /opt/cerfa/stop-app.sh cerfa_reverse_proxy

cd "${SCRIPT_DIR}"
docker build --tag cerfa_certbot certbot/
docker run --rm --name cerfa_certbot \
  -p 80:3000 \
  -v /opt/cerfa/data/certbot:/etc/letsencrypt \
  -v /opt/cerfa/data/ssl:/ssl \
  cerfa_certbot renew "$@"
cd -

start_app
bash /opt/cerfa/tools/send-to-slack.sh "[SSL] Certificat has been renewed"
