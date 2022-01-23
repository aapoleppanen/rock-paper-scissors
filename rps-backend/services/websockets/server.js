const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
const httpServer = require("../../index");

const server = new WebSocketServer({ server: httpServer, path: "live" });

server.on("connection", () => {
	console.log("Client connected");
});

server.on("error", (e) => {
	console.log(e);
});

const sendGame = async (event, type) => {
	server.clients.forEach((c) => {
		if (c.readyState === WebSocket.OPEN) {
			c.send(JSON.stringify({ ...event, type }));
		}
	});
};

module.exports = {
	server,
	sendGame,
};
