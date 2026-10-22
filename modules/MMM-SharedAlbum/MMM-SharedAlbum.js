Module.register("MMM-SharedAlbum", {
	defaults: {
		albums: [], // Google Photos share links, e.g. "https://photos.app.goo.gl/..."
		updateInterval: 30 * 1000, // next photo
		refreshInterval: 60 * 60 * 1000, // re-read the albums to pick up new photos
		size: "w1920-h1080", // Google scales the photo server-side
		opacity: 0.6 // dimmed (plus darker edges), so text on top stays readable
	},

	start () {
		this.photos = [];
		this.index = 0;
		this.load();
		setInterval(() => this.load(), this.config.refreshInterval);
		setInterval(() => this.next(), this.config.updateInterval);
	},

	load () {
		this.sendSocketNotification("SHARED_ALBUM_LOAD", { id: this.identifier, albums: this.config.albums });
	},

	socketNotificationReceived (notification, { id, photos }) {
		// An empty list means Google was unreachable: keep showing the old photos.
		if (notification !== "SHARED_ALBUM_PHOTOS" || id !== this.identifier || !photos.length) return;
		for (let i = photos.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[photos[i], photos[j]] = [photos[j], photos[i]];
		}
		const first = !this.photos.length;
		this.photos = photos;
		if (first) this.next();
	},

	next () {
		if (!this.photos.length) return;
		this.index = (this.index + 1) % this.photos.length;
		const url = `${this.photos[this.index]}=${this.config.size}`;
		const img = new Image();
		img.onload = () => {
			this.url = url;
			this.updateDom(2000);
		};
		img.src = url; // preload, so the fade never shows a half-loaded photo
	},

	getDom () {
		const div = document.createElement("div");
		div.style.cssText = `position:absolute;inset:0;background:#000 center/cover no-repeat;opacity:${this.config.opacity}`;
		if (this.url) div.style.backgroundImage = `radial-gradient(transparent 25%, #000 95%), url("${this.url}")`;
		return div;
	}
});
