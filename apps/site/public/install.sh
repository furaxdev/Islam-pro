#!/bin/sh
# Islam Pro — installer for Ubuntu/Debian.
# Usage: curl -fsSL https://islam-pro.vercel.app/install | sudo -E bash
set -eu

if ! command -v apt-get >/dev/null 2>&1; then
  echo "Islam Pro's Linux installer only supports Ubuntu/Debian (apt-get not found)." >&2
  echo "Get the .exe (Windows) or .dmg (macOS) instead: https://github.com/furaxdev/Islam-pro/releases/tag/desktop-latest" >&2
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "This script needs root to configure APT. Re-run as:" >&2
  echo "  curl -fsSL https://islam-pro.vercel.app/install | sudo -E bash" >&2
  exit 1
fi

echo "Adding the Islam Pro APT repository (Cloudsmith)..."
# Packages are only published for the "jammy" (22.04) codename in the
# Cloudsmith repo, but the .deb itself works fine on newer Ubuntu releases.
# Force that codename so auto-detection of a newer release (e.g. 24.04,
# 26.04...) doesn't 404 against a codename Cloudsmith has no packages for.
curl -1sLf 'https://dl.cloudsmith.io/public/furax-dev/islam-pro/setup.deb.sh' | distro=ubuntu codename=jammy bash

echo "Installing islam-pro..."
apt-get install -y islam-pro

echo "Done. Launch it from your applications menu, or run: islam-pro"
