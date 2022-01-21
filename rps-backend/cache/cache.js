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

const storeInCache = async (game) => {
	try {
		await client.json.arrAppend("data", ".games", formatGame(game));
	} catch (e) {
		console.log(e);
	}
};

const readCache = async () => {
	try {
		const result = await client.json.get("data", {
			path: [".games"],
		});
		return result;
	} catch (e) {
		console.log(e);
	}
};

module.exports = {
	client,
	clearCache,
	storeInCache,
	readCache,
	trimCache,
};
