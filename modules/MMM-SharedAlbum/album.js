// Reads a public Google Photos share link ("Teilen > Link erstellen") without the Photos API,
// which Google shut down for albums in March 2025.
// ponytail: parses the public share page, so it only sees the photos on its first page and breaks
// if Google changes that page. Check with `node album.js <link>`; fall back to a Drive folder if it does.
const PHOTO = /\["(https:\/\/lh3\.googleusercontent\.com\/pw\/[\w-]+)",\d+,\d+/g;

async function fetchPhotos (link) {
	const res = await fetch(link);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const html = await res.text();
	return [...new Set([...html.matchAll(PHOTO)].map((m) => m[1]))];
}

module.exports = { fetchPhotos };

if (require.main === module) {
	fetchPhotos(process.argv[2])
		.then((photos) => {
			console.log(`${photos.length} photos`);
			process.exit(photos.length ? 0 : 1);
		})
		.catch((e) => {
			console.error(e.message);
			process.exit(1);
		});
}
