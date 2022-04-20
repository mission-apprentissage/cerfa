#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec cerfa_server yarn --silent "$@"
