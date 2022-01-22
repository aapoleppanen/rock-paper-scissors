const WebSocket = require("ws");
const config = require("../util/config");
const cache = require("../cache/cache");
const { findPlayer } = require("../util/dbUtil");
const { sendGame } = require("./wsServer");

const ws = new WebSocket(config.WS_URI);

ws.on("message", async (data) => {
	try {
		const event = JSON.parse(JSON.parse(data));
		if (event.type == "GAME_RESULT") {
			await handleGameResult(event);
		} else if (event.type == "GAME_BEGIN") {
			await handleGameBegin(event);
		}
	} catch (e) {
		console.log(e);
	}
});

const handleGameResult = async (event) => {
	await cache.storeGameResult(event);
	await sendGame(event);
};

//add some kind of timer to check if the
//game is added to rps/history
//since not everything is given
const handleGameBegin = async (event) => {
	await cache.storeGameBegin(event);
	await sendGame(event);
	//add possible new players to db w/o adding their
	//games to avoid doubling games in db
	await findPlayer(event.playerA.name);
	await findPlayer(event.playerB.name);
};

module.exports = {
	client: ws,
};
