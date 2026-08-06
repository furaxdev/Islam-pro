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
# Packages are only published for Ubuntu 22.04 "jammy" in the Cloudsmith
# repo, but the .deb itself works fine on newer Ubuntu releases. Force all
# three of distro/version/codename together (not just codename) so a
# newer host release (24.04, 26.04...) doesn't leave the script mixing an
# overridden codename with an auto-detected version, which Cloudsmith
# doesn't recognise and silently fails to configure a working repo for.
curl -1sLf 'https://dl.cloudsmith.io/public/furax-dev/islam-pro/setup.deb.sh' | distro=ubuntu version=22.04 codename=jammy bash

echo "Installing islam-pro..."
apt-get install -y islam-pro

echo "Done. Launch it from your applications menu, or run: islam-pro"
