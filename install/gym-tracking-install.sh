#!/usr/bin/env bash

# Copyright (c) 2026 DicksonChris
# Author: DicksonChris
# License: MIT
# Source: https://github.com/DicksonChris/Gym-Tracking

source /dev/stdin <<<"$FUNCTIONS_FILE_PATH"
color
verb_ip6
catch_errors
setting_up_container
network_check
update_os

msg_info "Installing Dependencies"
$STD apt install -y git
msg_ok "Installed Dependencies"

NODE_VERSION="22" setup_nodejs

fetch_and_deploy_gh_release "pocketbase" "pocketbase/pocketbase" "prebuild" "latest" "/opt/pocketbase" "pocketbase*linux_$(arch_resolve).zip"

msg_info "Installing Gym-Tracking"
$STD git clone --depth 1 https://github.com/DicksonChris/Gym-Tracking.git /opt/gym-tracking
cd /opt/gym-tracking
# Baked into the server bundle at build time (server-to-PocketBase URL).
echo "VITE_POCKETBASE_URL=http://127.0.0.1:8090" >/opt/gym-tracking/.env
$STD npm ci
$STD npm run build
$STD npm prune --omit=dev
LOCAL_IP="$(hostname -I | awk '{print $1}')"
# Runtime env for the Node server. Behind a TLS reverse proxy (recommended),
# the origin is derived from the proxy's forwarded headers. The app's auth
# cookie is flagged Secure, so browsers require HTTPS (localhost excepted) —
# serve it through a TLS proxy for real use.
cat <<EOF >/opt/gym-tracking/.env.node
PORT=3000
HOST=0.0.0.0
PROTOCOL_HEADER=x-forwarded-proto
HOST_HEADER=x-forwarded-host
# Without a reverse proxy, comment the two HEADER lines above and use:
# ORIGIN=http://${LOCAL_IP}:3000
EOF
msg_ok "Installed Gym-Tracking"

msg_info "Configuring PocketBase"
mkdir -p /opt/pocketbase/{pb_data,pb_migrations,pb_hooks,pb_public}
cp -f /opt/gym-tracking/pb_migrations/*.js /opt/pocketbase/pb_migrations/
$STD /opt/pocketbase/pocketbase migrate up
PB_ADMIN_EMAIL="admin@gym-tracking.local"
PB_ADMIN_PASS="$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 16)"
$STD /opt/pocketbase/pocketbase superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASS"
{
  echo "PocketBase superuser"
  echo "URL: http://${LOCAL_IP}:8090/_/"
  echo "Email: ${PB_ADMIN_EMAIL}"
  echo "Password: ${PB_ADMIN_PASS}"
} >/root/gym-tracking.creds
chmod 600 /root/gym-tracking.creds
msg_ok "Configured PocketBase"

msg_info "Creating Services"
cat <<EOF >/etc/systemd/system/pocketbase.service
[Unit]
Description=PocketBase (Gym-Tracking backend)
After=network.target

[Service]
Type=simple
LimitNOFILE=4096
Restart=always
RestartSec=5s
StandardOutput=append:/opt/pocketbase/pocketbase.log
StandardError=append:/opt/pocketbase/pocketbase.log
ExecStart=/opt/pocketbase/pocketbase serve --http=0.0.0.0:8090

[Install]
WantedBy=multi-user.target
EOF

cat <<EOF >/etc/systemd/system/gym-tracking.service
[Unit]
Description=Gym-Tracking (SvelteKit)
After=network.target pocketbase.service
Requires=pocketbase.service

[Service]
Type=simple
WorkingDirectory=/opt/gym-tracking
Environment=NODE_ENV=production
EnvironmentFile=/opt/gym-tracking/.env.node
ExecStart=/usr/bin/node /opt/gym-tracking/build/index.js
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

systemctl enable -q --now pocketbase
systemctl enable -q --now gym-tracking
msg_ok "Created Services"

motd_ssh
customize
cleanup_lxc
