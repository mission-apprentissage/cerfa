#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKUP_NAS_DIR="/mnt/backups/agecap"
readonly BACKUP_LOCAL_DIR="/opt/cerfa/backups/agecap"
readonly BACKUP_FILE="${BACKUP_LOCAL_DIR}/agecap-$(date +'%Y-%m-%d_%H%M%S').tar.gz"

function backup() {
  echo "Creating backup..."
  mkdir -p "${BACKUP_LOCAL_DIR}"
  cd /opt/cerfa/data/server/agecap
  tar --create --gzip --file - *.pem | bash "${SCRIPT_DIR}/gpg/encrypt.sh" >"${BACKUP_FILE}"
  cd -
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
