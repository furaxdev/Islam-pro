#!/bin/bash
# Live status watcher for the current EAS Android build, with a spinner and
# elapsed timer. Cloud builds don't expose byte-level progress, so this
# shows real state transitions (queued -> in progress -> finished) instead
# of a fake percentage.
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

SPINNER=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
i=0
start=$(date +%s)

while true; do
  info=$(npx eas-cli@latest build:list --platform android --limit 1 --non-interactive 2>/dev/null | grep -E "^Status|^ID")
  status=$(echo "$info" | grep "^Status" | sed -E 's/^Status[[:space:]]+//')
  now=$(date +%s)
  elapsed=$((now - start))
  mins=$((elapsed / 60))
  secs=$((elapsed % 60))

  spin="${SPINNER[$((i % 10))]}"
  i=$((i + 1))

  case "$status" in
    "in queue") color="$YELLOW"; label="en file d'attente" ;;
    "in progress"|"in-progress"|"inProgress") color="$CYAN"; label="compilation en cours" ;;
    "finished") color="$GREEN"; label="terminé ✅" ;;
    "errored"|"canceled") color="$RED"; label="échec ❌" ;;
    *) color="$CYAN"; label="$status" ;;
  esac

  printf "\r${color}${BOLD}%s${RESET} %s ${BOLD}%02d:%02d${RESET}   \033[K" "$spin" "$label" "$mins" "$secs"

  if [ "$status" = "finished" ] || [ "$status" = "errored" ] || [ "$status" = "canceled" ]; then
    echo ""
    if [ "$status" = "finished" ]; then
      echo -e "${GREEN}${BOLD}🎉 APK prêt !${RESET}"
      npx eas-cli@latest build:list --platform android --limit 1 --non-interactive 2>/dev/null | grep -E "Application Archive URL"
    fi
    break
  fi

  sleep 4
done
