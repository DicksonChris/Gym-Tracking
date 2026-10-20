#!/usr/bin/env bash
_CS_DEFAULT_URL="https://raw.githubusercontent.com/DicksonChris/Gym-Tracking/main"
# Engine comes from community-scripts/core; this repo only ships the scripts.
_cs_boot="${COMMUNITY_SCRIPTS_CORE_DIR:-$(dirname "${BASH_SOURCE[0]}")/../../core}/core/build.func"
source "$_cs_boot" 2>/dev/null || source <(curl -fsSL "${COMMUNITY_SCRIPTS_CORE_URL:-https://raw.githubusercontent.com/community-scripts/core/main}/core/build.func")
# Copyright (c) 2026 DicksonChris
# Author: DicksonChris
# License: MIT
# Source: https://github.com/DicksonChris/Gym-Tracking

APP="Gym-Tracking"
var_tags="${var_tags:-fitness;sveltekit;pocketbase}"
var_cpu="${var_cpu:-2}"
var_ram="${var_ram:-2048}"
var_disk="${var_disk:-6}"
var_os="${var_os:-debian}"
var_version="${var_version:-13}"
var_arm64="${var_arm64:-yes}"
var_unprivileged="${var_unprivileged:-1}"

header_info "$APP"
variables
color
catch_errors

function update_script() {
  header_info
  check_container_storage
  check_container_resources
  if [[ ! -d /opt/gym-tracking || ! -f /etc/systemd/system/gym-tracking.service ]]; then
    msg_error "No ${APP} Installation Found!"
    exit
  fi

  msg_info "Stopping Services"
  systemctl stop gym-tracking pocketbase
  msg_ok "Stopped Services"

  msg_info "Updating ${APP}"
  cd /opt/gym-tracking
  git pull
  npm ci
  npm run build
  npm prune --omit=dev
  msg_ok "Updated ${APP}"

  msg_info "Updating PocketBase"
  /opt/pocketbase/pocketbase update || true
  cp -f /opt/gym-tracking/pb_migrations/*.js /opt/pocketbase/pb_migrations/
  msg_ok "Updated PocketBase"

  msg_info "Starting Services"
  systemctl start pocketbase gym-tracking
  msg_ok "Started Services"
  msg_ok "Updated successfully!"
  exit
}

start
build_container
description

msg_ok "Completed successfully!\n"
echo -e "${CREATING}${GN}${APP} setup has been successfully initialized!${CL}"
echo -e "${INFO}${YW}Access the app using the following URL:${CL}"
echo -e "${GATEWAY}${BGN}http://${IP}:3000${CL}"
echo -e "${INFO}${YW}PocketBase dashboard (superuser credentials in /root/gym-tracking.creds):${CL}"
echo -e "${GATEWAY}${BGN}http://${IP}:8090/_/${CL}"
