#!/bin/sh
# Copies config.js + the photo module to the Pi (keeping a backup of the old config) and restarts MagicMirror.
# Usage: ./deploy.sh [pi@192.168.178.163]
set -e
PI=${1:-pi@192.168.178.163}
cd "$(dirname "$0")"

if grep -q REPLACE_ME config/config.js; then
	echo "Fill in the REPLACE_ME links at the top of config/config.js first."
	exit 1
fi

# ustar keeps macOS metadata out of the archive, so GNU tar on the Pi extracts it silently.
COPYFILE_DISABLE=1 tar --format ustar -cf - config/config.js modules/MMM-SharedAlbum |
	ssh "$PI" 'cd /opt/mm/mounts && (cp config/config.js "config/config.js.bak-$(date +%F-%H%M)" || true) && tar -xf -'
ssh -t "$PI" 'sudo docker restart mm'
echo "Done. Logs: ssh $PI 'sudo docker logs --tail 50 mm'"
