#!/bin/bash
# Applies the Finder window styling (background image, icon positions, window
# size) to a .dmg that was built headlessly (e.g. on a GitHub Actions
# runner). Tauri's own DMG bundler drives this via AppleScript targeting
# Finder, which silently no-ops without a real interactive GUI session — CI
# runners lack one, so a CI-built DMG has the background/icon files on disk
# but no .DS_Store recording their layout, and Finder falls back to a plain
# default view.
#
# This step needs almost no CPU (a few seconds of osascript, no compiling),
# so it's safe to run locally even on a machine where a full Rust rebuild
# isn't. Usage: bash finalize-dmg-style.sh "builds/Islam Pro Installer.dmg"
set -euo pipefail

SRC_DMG="${1:?Usage: finalize-dmg-style.sh <path-to-dmg>}"
VOL_NAME="Islam Pro Installer"
APP_NAME="Islam Pro.app"
RW_DMG="/tmp/islam-pro-style-rw.dmg"
WINDOW_W=660
WINDOW_H=400
APP_X=180
APP_Y=170
APPLICATIONS_X=480
APPLICATIONS_Y=170

rm -f "$RW_DMG"
hdiutil convert "$SRC_DMG" -format UDRW -o "$RW_DMG"

ATTACH_OUT=$(hdiutil attach "$RW_DMG")
MOUNT_DIR=$(echo "$ATTACH_OUT" | grep -Eo '/Volumes/.*' | head -1)
DISK_ID=$(echo "$ATTACH_OUT" | grep -Eo '/dev/disk[0-9]+' | head -1)

osascript <<EOF
tell application "Finder"
  tell disk "$(basename "$MOUNT_DIR")"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set bounds of container window to {400, 100, 400 + $WINDOW_W, 100 + $WINDOW_H}
    set viewOptions to icon view options of container window
    set arrangement of viewOptions to not arranged
    set icon size of viewOptions to 96
    set background picture of viewOptions to file ".background:dmg-background.png"
    set position of item "$APP_NAME" of container window to {$APP_X, $APP_Y}
    set position of item "Applications" of container window to {$APPLICATIONS_X, $APPLICATIONS_Y}
    close
    open
    update without registering applications
    delay 2
  end tell
end tell
EOF

sync
hdiutil detach "$DISK_ID" -force

rm -f "$SRC_DMG"
hdiutil convert "$RW_DMG" -format UDZO -imagekey zlib-level=9 -o "$SRC_DMG"
rm -f "$RW_DMG"

echo "Styled: $SRC_DMG"
