#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo
readonly TEXT_MESSAGE=${1:?"Please provide a text message"}
readonly SLACK_URL="{{ vault[env_type].CERFA_SLACK_WEBHOOK_URL }}"
readonly CHANNEL_NAME="#XXXXXXXXX"
readonly MNA_ENV=$(cat /env)

curl -s -o /dev/null -X POST --data-urlencode \
  "payload={\"text\": \"[${MNA_ENV}]${TEXT_MESSAGE}\", \"channel\": \"${CHANNEL_NAME}\" }" "${SLACK_URL}"
