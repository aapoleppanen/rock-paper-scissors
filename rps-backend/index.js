const https = require("https");
const app = require("./app");
const config = require("./config/config");
const ws = require("./services/websockets/server");

const server = https.createServer(app);

server.on("upgrade", () => {
	ws.handleUpgrade(request, socket, head, function (w) {
		ws.emit("connection", w, request);
	});
});

server.listen(config.PORT);
console.log(`Server running on port ${config.PORT}`);
