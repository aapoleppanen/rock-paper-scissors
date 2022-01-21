const WebSocket = require("ws");
const config = require("../util/config");
const cache = require("../cache/cache");
const { findPlayer } = require("../util/dbUtil");

const ws = new WebSocket(config.WS_URI);

//consider implementation in which playerstats are also
//cached
ws.on("message", async (data) => {
	try {
		const event = JSON.parse(JSON.parse(data));
		if (event.type == "GAME_RESULT") {
			cache.storeInCache(event);
		} else if (event.type == "GAME_BEGIN") {
			//add possible new players to db w/o adding their
			//games to avoid doubling games in db
			await findPlayer(event.playerA.name);
			await findPlayer(event.playerB.name);
		}
	} catch (e) {
		console.log(e);
	}
});

module.exports = {
	client: ws,
};
