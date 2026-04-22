#!/bin/bash
# One-shot Ubuntu Live setup for Jetson flash.
# Usage in Ubuntu Live terminal:
#   curl -L micro.svita.ai/u.sh | bash
set -e
echo "▶ Installing openssh-server, curl, tailscale…"
sudo apt update -y
sudo apt install -y openssh-server curl
curl -fsSL https://tailscale.com/install.sh | sudo sh
echo ""
echo "▶ Set a password for user 'ubuntu' (type twice, invisible):"
sudo passwd ubuntu
echo ""
echo "▶ Starting SSH server…"
sudo systemctl enable --now ssh
echo ""
echo "▶ Tailscale login — open the URL below in Firefox, log in as tatyana-mama@"
sudo tailscale up
echo ""
IP=$(tailscale ip -4 | head -1)
echo "========================================================"
echo "✅ READY. Tell Kai:"
echo "   Tailscale IP: $IP"
echo "   ubuntu password: (the one you set above)"
echo "========================================================"
