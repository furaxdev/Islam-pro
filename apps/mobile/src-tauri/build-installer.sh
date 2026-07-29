#!/bin/bash
# Rebuilds the DMG (background/icons already baked in by `tauri build --bundles dmg`,
# using the app's normal icon.icns), then renames the mounted volume + output
# file to "Islam Pro Installer", since Tauri's DmgConfig has no field for a
# custom volume label (it always derives it from productName).
set -euo pipefail

cd "$(dirname "$0")/.."

# Set TAURI_TARGET to cross-compile (e.g. from an Apple Silicon CI runner to
# an Intel Mac via "x86_64-apple-darwin"). Empty = build for the host arch,
# same as running this locally.
TARGET="${TAURI_TARGET:-}"
if [ -n "$TARGET" ]; then
  DMG_DIR="src-tauri/target/$TARGET/release/bundle/dmg"
  BUILD_ARGS=(--bundles dmg --target "$TARGET")
  case "$TARGET" in
    aarch64-*) ARCH_SUFFIX="aarch64" ;;
    *) ARCH_SUFFIX="x64" ;;
  esac
else
  DMG_DIR="src-tauri/target/release/bundle/dmg"
  BUILD_ARGS=(--bundles dmg)
  ARCH_SUFFIX="x64"
fi
SRC_DMG="$DMG_DIR/Islam Pro_1.0.0_${ARCH_SUFFIX}.dmg"
FINAL_NAME="Islam Pro Installer"
RW_DMG="/tmp/islam-pro-installer-rw.dmg"
BUILDS_DIR="builds"

rm -rf "$DMG_DIR"
pnpm exec tauri build "${BUILD_ARGS[@]}"

rm -f "$RW_DMG"
hdiutil convert "$SRC_DMG" -format UDRW -o "$RW_DMG"

ATTACH_OUT=$(hdiutil attach "$RW_DMG" -nobrowse)
MOUNT_DIR=$(echo "$ATTACH_OUT" | grep -Eo '/Volumes/.*')
DISK_ID=$(echo "$ATTACH_OUT" | grep -Eo '/dev/disk[0-9]+' | head -1)

diskutil rename "$MOUNT_DIR" "$FINAL_NAME"
hdiutil detach "$DISK_ID" -force

rm -f "$DMG_DIR/$FINAL_NAME.dmg"
hdiutil convert "$RW_DMG" -format UDZO -imagekey zlib-level=9 -o "$DMG_DIR/$FINAL_NAME.dmg"
rm -f "$RW_DMG" "$SRC_DMG"

mkdir -p "$BUILDS_DIR"
cp "$DMG_DIR/$FINAL_NAME.dmg" "$BUILDS_DIR/$FINAL_NAME.dmg"

echo "Installer ready: $BUILDS_DIR/$FINAL_NAME.dmg"
