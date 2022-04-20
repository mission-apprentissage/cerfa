#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "/opt/cerfa/data/ssl/privkey.pem" ]; then
  cd "${SCRIPT_DIR}"
    docker build --tag cerfa_certbot certbot/
    docker run --rm --name cerfa_certbot \
      -p 80:3000 \
      -v /opt/cerfa/data/certbot:/etc/letsencrypt \
      -v /opt/cerfa/data/ssl:/ssl \
      cerfa_certbot generate "$@"
  cd -
else
  echo "Certificat SSL déja généré"
fi
