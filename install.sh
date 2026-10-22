#!/bin/sh
# Run on the Pi from this folder: copies the config and the photo module into MagicMirrorOS
# (keeping a backup of the old config.js) and restarts MagicMirror.
set -e
cd "$(dirname "$0")"
M=/opt/mm/mounts

if [ ! -f config/config.env ]; then
	cp config/config.env.example config/config.env
	echo "Created config/config.env. Fill in the three links (nano config/config.env), then run ./install.sh again."
	exit 1
fi
if grep -q XXXX config/config.env; then
	echo "config/config.env still contains XXXX placeholders."
	exit 1
fi

if [ -f $M/config/config.js ]; then
	cp $M/config/config.js "$M/config/config.js.bak-$(date +%F-%H%M)"
fi
cp config/config.js config/config.env $M/config/
rm -rf $M/modules/MMM-SharedAlbum
cp -r modules/MMM-SharedAlbum $M/modules/

sudo docker restart mm
echo "Restarted. Check with: sudo docker logs --tail 30 mm"
