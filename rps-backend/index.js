const http = require("http");
const app = require("./app");
const config = require("./config/config");
const ws = require("./services/websockets/server");

const server = http.createServer(app);

server.on("upgrade", function upgrade(request, socket, head) {
	ws.server.handleUpgrade(request, socket, head, function done(w) {
		ws.server.emit("connection", w, request);
	});
});

server.listen(config.PORT);
console.log(`Server running on port ${config.PORT}`);
