const NodeHelper = require("node_helper");
const Log = require("logger");
const { fetchPhotos } = require("./album");

module.exports = NodeHelper.create({
	async socketNotificationReceived (notification, { id, albums }) {
		if (notification !== "SHARED_ALBUM_LOAD") return;
		const photos = [];
		for (const album of albums) {
			try {
				photos.push(...await fetchPhotos(album));
			} catch (e) {
				Log.error(`${album}: ${e.message}`);
			}
		}
		Log.info(`${photos.length} photos from ${albums.length} album(s)`);
		this.sendSocketNotification("SHARED_ALBUM_PHOTOS", { id, photos });
	}
});
