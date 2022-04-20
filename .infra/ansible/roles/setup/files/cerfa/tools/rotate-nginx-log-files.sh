#!/usr/bin/env bash
set -euo pipefail

docker exec cerfa_reverse_proxy bash -c "/usr/sbin/logrotate -s /data/status /etc/logrotate.conf"
