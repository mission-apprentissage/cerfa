#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKUP_NAS_DIR="/mnt/backups/storage"
readonly BACKUP_LOCAL_DIR="/opt/cerfa/backups/storage"
readonly BACKUP_FILE="${BACKUP_LOCAL_DIR}/storage-$(date +'%Y-%m-%d_%H%M%S').zip"

function backup() {
  echo "Creating backup..."
  mkdir -p "${BACKUP_LOCAL_DIR}"
  bash /opt/cerfa/server-yarn.sh zipStorage | bash "${SCRIPT_DIR}/gpg/encrypt.sh" >"${BACKUP_FILE}"
}

function replicate_backups() {
  echo "Replicating backups..."
  mkdir -p "${BACKUP_NAS_DIR}"
  rsync -rltzv "${BACKUP_LOCAL_DIR}/" "${BACKUP_NAS_DIR}/"
}

function remove_old_backups() {
  echo "Removing local backups older than 7 days..."
  find "${BACKUP_LOCAL_DIR}" -mindepth 1 -maxdepth 1 -prune -ctime +7 -exec rm -r "{}" \;
}

backup
replicate_backups
remove_old_backups
