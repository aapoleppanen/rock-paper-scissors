const WebSocket = require("ws");
const config = require("../../config/config");
const cache = require("../../cache/cache");
const { findPlayer, formatGame } = require("../../util/formatter");
const { sendGame } = require("./server");

const ws = new WebSocket(config.WS_URI);

//handle live updates from the api
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
	await sendGame(formatGame(event), "GAME_RESULT");
};

const handleGameBegin = async (event) => {
	await cache.storeGameBegin(event);
	await sendGame(formatGame(event), "GAME_BEGIN");
	//check if players exist in the database
	//if they do not, add the players
	await findPlayer(event.playerA.name);
	await findPlayer(event.playerB.name);
};

module.exports = {
	client: ws,
};
