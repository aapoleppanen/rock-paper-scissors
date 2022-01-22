const redis = require("redis");
const config = require("../util/config");
const { formatGame } = require("../util/dbUtil");

const client = redis.createClient({
	url: config.REDIS_URI,
});

client.on("connect", () => {
	console.log("Connected to Redis");
});

client.on("error", (e) => {
	console.log(e);
});

const clearCache = async (game) => {
	try {
		await client.json.set("data", "$", {
			games: [],
			liveGames: [],
		});
	} catch (e) {
		console.log(e);
	}
};

const trimCache = async () => {
	try {
		const curLen = await client.json.arrLen("data", "games");
		await client.json.arrTrim(
			"data",
			"games",
			Math.max(0, curLen - config.CACHE_LENGTH),
			curLen
		);
	} catch (e) {
		console.log(e);
	}
};

const storeGameResult = async (game) => {
	try {
		await client.json.arrAppend("data", ".games", formatGame(game));
		const liveGames = await getLiveGames();
		await client.json.set(
			"data",
			".liveGames",
			liveGames.filter((g) => g.gameId !== game.gameId)
		);
	} catch (e) {
		console.log(e);
	}
};

const storeGameBegin = async (game) => {
	try {
		await client.json.arrAppend("data", ".liveGames", formatGame(game));
	} catch (e) {
		console.log(e);
	}
};

const getCompletedGames = async () => {
	try {
		const result = await client.json.get("data", {
			path: [".games"],
		});
		return result;
	} catch (e) {
		console.log(e);
	}
};

const getLiveGames = async () => {
	try {
		const result = await client.json.get("data", {
			path: [".liveGames"],
		});
		return result;
	} catch (e) {
		console.log(e);
	}
};

module.exports = {
	client,
	clearCache,
	storeGameResult,
	storeGameBegin,
	getCompletedGames,
	getLiveGames,
	trimCache,
};
