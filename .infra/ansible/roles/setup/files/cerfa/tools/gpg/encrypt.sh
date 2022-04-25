#!/usr/bin/env bash
set -euo pipefail

readonly RECIPIENTS_KEYS="{{ gpg_keys }}"

function add_recipients() {
  local -n array=$1
  local devops_key
  devops_key="$(cat "/root/.gnupg/publickey.asc" | gpg --quiet --import-options show-only --import --with-colons | grep pub | awk -F ":" '{print $5}')"
  IFS=', ' read -r -a keys <<<"$RECIPIENTS_KEYS"

  array+=("-r ${devops_key}")
  for key in "${keys[@]}"; do
    array+=("-r ${key}")
  done
}

function encrypt() {
  local input=${1:-/dev/stdin}
  local recipients

  add_recipients recipients
  gpg \
    --default-key "mna_devops" \
    --encrypt \
    --cipher-algo AES256 \
    --always-trust \
    ${recipients[*]} <"${input}"

}

encrypt "$@"
