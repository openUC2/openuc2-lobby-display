# openUC2 lobby display

MagicMirror² setup for the office lobby screen in Jena: company photos from a shared Google Photos
album, the sales deck from Google Slides, the company calendar with Thuringia holidays, Jena weather,
rotating motivational lines and a news ticker with openUC2 releases and optics news.

Runs on a Raspberry Pi 4 with [MagicMirrorOS](https://github.com/guysoft/MagicMirrorOS)
(MagicMirror in the Docker container `mm`, files under `/opt/mm/mounts`).

| File | What it is |
|---|---|
| `config/config.js` | Screen layout and content. No secrets, safe to commit. |
| `config/config.env` | Your three private links. Git-ignored, only on the Pi. |
| `modules/MMM-SharedAlbum` | Shows photos from a Google Photos share link (no API, no tokens). |
| `install.sh` | Copies everything into MagicMirrorOS and restarts it. |

## Setup on the Pi

```bash
git clone https://github.com/openUC2/openuc2-lobby-display
cd openuc2-lobby-display
./install.sh          # first run creates config/config.env and stops
nano config/config.env
./install.sh          # copies files, restarts MagicMirror (asks for the sudo password)
```

Then check it started:

```bash
sudo docker logs --tail 30 mm
```

You want to see `Your configuration file doesn't contain syntax errors :)` and
`[MMM-SharedAlbum] N photos from 1 album(s)` with N > 0. After about a minute `sudo docker ps`
should show `mm` as `(healthy)`. From a laptop in the office network the screen is also visible at
`http://<pi-ip>:8080`.

## The three links in `config/config.env`

One `NAME=link` per line, no quotes, no spaces.

- **`PHOTO_ALBUM`**: in Google Photos open the album, *Teilen* > *Link erstellen*. Turn on
  *Zusammenarbeiten* so everyone can add photos from their phone. Looks like
  `https://photos.app.goo.gl/...`.
- **`COMPANY_CALENDAR`**: in Google Calendar, *Einstellungen* > the company calendar >
  *Kalender integrieren* > **Geheime Adresse im iCal-Format**. It ends in `/basic.ics`.
  The normal share link (`calendar.google.com/calendar/u/0?cid=...`) does not work: it shows 0 events.
- **`SALES_SLIDES`**: the deck's share link (*Teilen* > *Jeder mit dem Link* > copy link,
  `.../edit?usp=sharing`) or a *Datei* > *Freigeben* > *Im Web veröffentlichen* link. Either works:
  the config turns it into an auto-playing, looping embed (15 s per slide). It must open without a
  Google login, so not "only openUC2 members".

Anyone who has one of these links can see what's behind it, so keep `config.env` off GitHub.

## Updating

Edit on your laptop, commit, push. Then on the Pi:

```bash
cd ~/openuc2-lobby-display && git pull && ./install.sh
```

Changing content in Google Photos, Calendar or Slides needs no restart: photos refresh hourly,
the calendar hourly, the deck live.

## Customising

All in `config/config.js`:

- **Motivational lines**: `compliments` (by time of day, weekday, weather in Jena, special dates).
- **News**: `newsfeed` > `feeds`.
- **Photo speed / brightness**: `MMM-SharedAlbum` > `updateInterval`, `opacity` (0 to 1).
- **Slide speed**: `delayms=15000` in the `SLIDES_EMBED` line.

## Troubleshooting

- **"Cannot access config file ... Invalid or unexpected token"**: `config.js` on the Pi is broken,
  usually from pasting it into nano. Don't paste it; `git pull && ./install.sh` copies it byte-exact.
- **No photos**: test the album link inside the container:
  `sudo docker exec mm node /opt/magic_mirror/modules/MMM-SharedAlbum/album.js "<album link>"`.
  It should print the number of photos. `MMM-SharedAlbum` reads Google's public share page, which is
  unofficial: if Google changes that page, photos stop and the rest of the screen keeps running.
- **Slides show a login page**: the deck isn't viewable by "anyone with the link".
- **Why not MMM-GooglePhotos?** Google removed the Photos Library API scopes it needs on
  31 March 2025; its OAuth flow now fails with a 400 and can't be fixed in the Cloud Console.
