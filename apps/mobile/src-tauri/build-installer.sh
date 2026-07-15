#!/bin/bash
# Rebuilds the DMG (background/icons already baked in by `tauri build --bundles dmg`,
# using the app's normal icon.icns), then renames the mounted volume + output
# file to "Islam Pro Installer", since Tauri's DmgConfig has no field for a
# custom volume label (it always derives it from productName).
set -euo pipefail

cd "$(dirname "$0")/.."

DMG_DIR="src-tauri/target/release/bundle/dmg"
SRC_DMG="$DMG_DIR/Islam Pro_1.0.0_x64.dmg"
FINAL_NAME="Islam Pro Installer"
RW_DMG="/tmp/islam-pro-installer-rw.dmg"

rm -rf "$DMG_DIR"
pnpm exec tauri build --bundles dmg

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

echo "Installer ready: $DMG_DIR/$FINAL_NAME.dmg"
