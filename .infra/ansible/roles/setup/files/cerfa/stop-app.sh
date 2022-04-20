#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo
readonly CONTAINER_FILTER=${1:-"cerfa*"};

echo "Arrêt des conteneurs ${CONTAINER_FILTER}..."
docker container stop $(docker container ls -q --filter name="${CONTAINER_FILTER}") || true
