#!/bin/sh
# Islam Pro — installer for Ubuntu/Debian.
# Usage: curl -fsSL https://islam-pro.vercel.app/install.sh | sudo -E bash
set -eu

if ! command -v apt-get >/dev/null 2>&1; then
  echo "Islam Pro's Linux installer only supports Ubuntu/Debian (apt-get not found)." >&2
  echo "Get the .exe (Windows) or .dmg (macOS) instead: https://github.com/furaxdev/Islam-pro/releases/tag/desktop-latest" >&2
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "This script needs root to configure APT. Re-run as:" >&2
  echo "  curl -fsSL https://islam-pro.vercel.app/install.sh | sudo -E bash" >&2
  exit 1
fi

echo "Adding the Islam Pro APT repository (Cloudsmith)..."
curl -1sLf 'https://dl.cloudsmith.io/public/furax-dev/islam-pro/setup.deb.sh' | bash

echo "Installing islam-pro..."
apt-get install -y islam-pro

echo "Done. Launch it from your applications menu, or run: islam-pro"
