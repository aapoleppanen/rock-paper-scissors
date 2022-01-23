const { WebSocketServer } = require("ws");
const WebSocket = require("ws");

const server = new WebSocketServer({ noServer: true });

server.on("connection", () => {
	console.log("Client connected");
});

server.on("error", (e) => {
	console.log(e);
});

const sendGame = async (event, type) => {
	try {
		server.clients.forEach((c) => {
			if (c.readyState === WebSocket.OPEN) {
				c.send(JSON.stringify({ ...event, type }));
			}
		});
	} catch (e) {}
};

module.exports = {
	server,
	sendGame,
};
