#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec -it cerfa_mongodb mongo "{{ vault[env_type].CERFA_MONGODB_URI }}" "$@"
