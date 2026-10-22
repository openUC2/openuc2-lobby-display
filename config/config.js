/* openUC2 lobby display, Jena. See README.md for setup.
 * The three links come from config.env next to this file (MagicMirror fills in the
 * placeholders below at startup), so this file holds no secrets and can live in git.
 */
const PHOTO_ALBUM = "${PHOTO_ALBUM}";
const COMPANY_CALENDAR = "${COMPANY_CALENDAR}";
// Any Slides link works (.../edit?usp=sharing or a "Publish to web" link): we turn it into an auto-playing embed.
const SLIDES_EMBED = "${SALES_SLIDES}".replace(/\/(edit|pub|embed|preview)\b.*$/, "") + "/embed?start=true&loop=true&delayms=15000&rm=minimal";

const JENA = { lat: 50.9271, lon: 11.5892 };

let config = {
	address: "0.0.0.0", // not "localhost": the container healthcheck calls 127.0.0.1
	port: 8080,
	basePath: "/",
	// Loopback plus the office LAN, so you can preview at http://<pi-ip>:8080 from a laptop.
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.178.0/24"],

	language: "de",
	locale: "de-DE",
	timeFormat: 24,
	units: "metric",

	modules: [
		{ module: "alert" },

		{
			module: "MMM-SharedAlbum",
			position: "fullscreen_below",
			config: {
				albums: [PHOTO_ALBUM],
				updateInterval: 30 * 1000
			}
		},

		{
			module: "clock",
			position: "top_left",
			config: {
				dateFormat: "dddd, D. MMMM",
				showWeek: true
			}
		},
		{
			module: "calendar",
			header: "Termine",
			position: "top_left",
			config: {
				maximumEntries: 8,
				calendars: [
					{ symbol: "calendar-check", url: COMPANY_CALENDAR },
					{
						symbol: "umbrella-beach",
						url: "https://calendar.google.com/calendar/ical/de.german%23holiday%40group.v.calendar.google.com/public/basic.ics",
						// Google's list covers every state and lots of "Gedenktage"; keep only days off in Thüringen.
						excludedEvents: [{ filterBy: "^(?!Neujahr|Karfreitag|Ostermontag|Tag der Arbeit|Christi Himmelfahrt|Pfingstmontag|Weltkindertag|Tag der Deutschen Einheit|Reformationstag|Heiligabend|Erster Weihnachtstag|Zweiter Weihnachtstag|Silvester)", regex: true }]
					}
				]
			}
		},

		{
			module: "helloworld",
			position: "top_center",
			config: {
				text: "<iframe src=\"" + SLIDES_EMBED + "\" style=\"width:46vw;aspect-ratio:16/9;border:0;border-radius:12px\"></iframe>"
			}
		},

		{
			module: "weather",
			position: "top_right",
			header: "Wetter", // the module appends "Jena, DE-TH"
			config: { weatherProvider: "openmeteo", type: "current", ...JENA }
		},
		{
			module: "weather",
			position: "top_right",
			header: "Die nächsten Tage",
			config: { weatherProvider: "openmeteo", type: "forecast", maxNumberOfDays: 4, appendLocationNameToHeader: false, ...JENA }
		},

		{
			module: "compliments",
			position: "lower_third",
			config: {
				updateInterval: 20 * 1000,
				compliments: {
					anytime: [
						"Ernst Abbe hat hier die Optik neu gedacht. Wir machen sie offen.",
						"Jena ist die Lichtstadt. Wir bringen das Licht in die Welt.",
						"Jeder Würfel, den wir bauen, macht Wissenschaft zugänglicher.",
						"Große Ideen passen in kleine Würfel.",
						"Open Source ist Teamsport.",
						"Fehler sind auch nur Daten.",
						"Doku schreiben ist auch Entwicklung.",
						"Erst funktionierend, dann schön, dann schnell.",
						"Heute schon jemandem gezeigt, wie man etwas Neues sieht?",
						"Make optics accessible. One cube at a time."
					],
					morning: [
						"Guten Morgen, Team! Erst Kaffee, dann Photonen.",
						"Moin! Was bringen wir heute zum Leuchten?",
						"Neuer Tag, neue Experimente."
					],
					afternoon: [
						"Halbzeit. Kurz durchatmen, dann wieder scharf stellen.",
						"Mittagspause im Paradies? Die Saale wartet.",
						"Fokus finden, Fokus halten."
					],
					evening: [
						"Danke für heute!",
						"Laser aus, Lötkolben aus? Dann schönen Feierabend!",
						"Gute Arbeit heute. Morgen geht's weiter."
					],
					// Weather in Jena (sent by the weather module)
					day_sunny: ["Sonne über Jena: perfektes Licht für jedes Experiment."],
					day_showers: ["Regen in Jena. Ideales Wetter zum Tüfteln."],
					day_fog: ["Nebel über der Saale. Wir sorgen für klare Sicht."],
					"day_snow-wind": ["Schnee auf dem Jenzig. Heißer Tee, ruhige Hände."],
					// Weekdays (cron: minute hour day month weekday)
					"* 8-10 * * MON": ["Neue Woche, neue Würfel. Los geht's!"],
					"* 14-17 * * FRI": ["Freitag! Was haben wir diese Woche geschafft?"],
					// Special days
					"....-01-01": ["Frohes neues Jahr! Auf ein helles Jahr."],
					"....-01-23": ["Heute hat Ernst Abbe Geburtstag (1840). Danke für die Optik!"],
					"....-03-14": ["Happy Pi Day! 3,14159..."],
					"....-05-16": ["Internationaler Tag des Lichts. Unser Feiertag!"],
					"....-09-11": ["Heute hat Carl Zeiss Geburtstag (1816). Jena sagt danke."],
					"....-12-24": ["Frohe Weihnachten, Team!"]
				}
			}
		},

		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{ title: "openUC2 ImSwitch", url: "https://github.com/openUC2/ImSwitch/releases.atom" },
					{ title: "openUC2 UC2-REST", url: "https://github.com/openUC2/UC2-REST/releases.atom" },
					{ title: "Optik & Photonik", url: "https://phys.org/rss-feed/physics-news/optics-photonics/" },
					{ title: "Hackaday", url: "https://hackaday.com/blog/feed/" }
				],
				showSourceTitle: true,
				showPublishDate: true
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
