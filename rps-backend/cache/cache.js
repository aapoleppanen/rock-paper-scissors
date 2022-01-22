const redis = require("redis");
const config = require("../config/config");
const { formatGame } = require("../util/formatter");
const { sendGame } = require("../services/websockets/server");
const history = require("../services/history");

const client = redis.createClient({
	url: config.REDIS_URI,
});

client.on("connect", () => {
	console.log("Connected to Redis");
	//intervally check if livegames have been added to history
	//since the api does not send a "GAME_RESULT" update
	//for all games
	setInterval(() => {
		updateLiveGames();
	}, config.LIVE_GAME_CHECK_INTERVAL);
});

client.on("error", (e) => {
	console.log(e);
});

//clear the cache
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

//trim to cache
//this function is called when the database is updated
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
		const duplicate = await checkForCompletedDuplicates(game);
		if (!duplicate) {
			await client.json.arrAppend("data", ".games", formatGame(game));
		}
		await removeFromLiveGames(game);
	} catch (e) {
		console.log(e);
	}
};

const storeGameBegin = async (game) => {
	try {
		const duplicate = await checkForLiveDuplicates(game);
		if (!duplicate) {
			await client.json.arrAppend("data", ".liveGames", formatGame(game));
		}
	} catch (e) {
		console.log(e);
	}
};

const checkForCompletedDuplicates = async (game) => {
	try {
		const games = await getCompletedGames();
		return games.find((g) => g.gameId === game.gameId);
	} catch (e) {
		console.log(e);
	}
};

const checkForLiveDuplicates = async (game) => {
	try {
		const games = await getLiveGames();
		return games.find((g) => g.gameId === game.gameId);
	} catch (e) {
		console.log(e);
	}
};

const removeFromLiveGames = async (game) => {
	const liveGames = await getLiveGames();
	await client.json.set(
		"data",
		".liveGames",
		liveGames.filter((g) => g.gameId !== game.gameId)
	);
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

const getPlayerGames = async (name) => {
	const cachedGames = await getCompletedGames();
	const playerGames = await cachedGames.filter(
		(g) => g.playerA == name || g.playerB == name
	);
	return playerGames.sort((a, b) => b.t - a.t);
};

const updateLiveGames = async () => {
	try {
		const games = await getRecentHistory();
		const liveGames = await getLiveGames();
		for (let g of liveGames) {
			// checkForCompletedDuplicates(g) ||
			const duplicate = games.find((p) => p.gameId === g.gameId);
			if (duplicate) {
				await removeFromLiveGames(g);
				await storeGameResult(duplicate);
				//ususally sends unformatted games
				await sendGame(formatGame(duplicate), "GAME_RESULT");
			}
		}
	} catch (e) {
		console.log(e);
	}
};

const getRecentHistory = async () => {
	const games1 = await history.getHistory(config.DEFAULT_CURSOR);
	const games2 = await history.getHistory(games1.cursor);
	return [...games1.data, ...games2.data];
};

//refactor some of this logic to the client
//side so that the client requests
//data from the redis database on change
//then this data can be dynamically updated
//in the front end!

module.exports = {
	client,
	clearCache,
	storeGameResult,
	storeGameBegin,
	getCompletedGames,
	getLiveGames,
	trimCache,
	getPlayerGames,
};
