const express = require("express");
const config = require("./util/config");
const app = express();
const mongoose = require("mongoose");
const db = require("./util/db");
const cache = require("./cache/cache");
const ws = require("./ws/ws");
const cors = require("cors");
const middleware = require("./util/middleware");

//router imports
const playersRouter = require("./controllers/players");
const gamesRouter = require("./controllers/games");

const { clearCollections, initDatabase } = require("./util/db");

mongoose
	.connect(config.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");
		db.syncDatabase();
		setInterval(async () => {
			db.syncDatabase();
		}, 300 * 1000);
	})
	.catch((error) => {
		console.log("Error connecting to mongoDB", error.message);
	});

cache.client.connect();
cache.clearCache();

ws.client.on("open", function open() {
	console.log("Connected to WS");
});

app.use(express.json());
app.use(cors());

app.use("/api/players", playersRouter);
app.use("/api/games", gamesRouter);

app.use(middleware.errorHandler);

module.exports = app;
