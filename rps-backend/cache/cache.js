const redis = require("redis");
const config = require("../util/config");
const { formatGame } = require("../util/dbUtil");
const fetch = require("node-fetch");
const { sendGame } = require("../ws/wsServer");

const client = redis.createClient({
	url: config.REDIS_URI,
});

client.on("connect", () => {
	console.log("Connected to Redis");
	setInterval(() => {
		checkLiveGames();
	}, config.LIVE_GAME_CHECK_INTERVAL);
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
		const completedGames = await getCompletedGames();
		if (!completedGames.find((g) => g.gameId === game.gameId)) {
			await client.json.arrAppend("data", ".games", formatGame(game));
		}
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
		// await checkLiveGame(game);
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

const checkLiveGame = async (game) => {
	const checkOnDelay = async (game) => {
		try {
			await delay(config.LIVE_GAME_TIMEOUT);

			const cursor = "/rps/history";
			const res = await fetch(`${config.API_URI}${cursor}`);
			const games = await res.json();
			const gameResult = games.data.find((g) => g.gameId === game.gameId);
			const liveGames = await getLiveGames();
			const completedGames = await getCompletedGames();
			const hasBeenAdded = await completedGames.find(
				(g) => g.gameId === game.gameId
			);
			if (gameResult && !hasBeenAdded) {
				await client.json.set(
					"data",
					".liveGames",
					liveGames.filter((g) => g.gameId !== game.gameId)
				);
				//save the game and send it to the clients
				await storeGameResult(gameResult);
				await sendGame(gameResult);
			}
		} catch (e) {
			console.log(e);
		}
	};
	checkOnDelay(game);
};

const checkLiveGames = async () => {
	try {
		let games = [];
		const cursor = "/rps/history";
		const res1 = await fetch(`${config.API_URI}${cursor}`);
		const games1 = await res1.json();
		const res2 = await fetch(`${config.API_URI}${games1.cursor}`);
		const games2 = await res2.json();
		games = games.concat(games1.data);
		games = games.concat(games2.data);
		const liveGames = await getLiveGames();
		const completedGames = await getCompletedGames();
		for (const game of liveGames) {
			const gameResult = games.find((g) => g.gameId === game.gameId);
			const hasBeenAdded = await completedGames.find(
				(g) => g.gameId === game.gameId
			);
			if (gameResult && !hasBeenAdded) {
				await client.json.set(
					"data",
					".liveGames",
					liveGames.filter((g) => g.gameId !== game.gameId)
				);
				//save the game and send it to the clients
				await storeGameResult(gameResult);
				await sendGame(gameResult);
			}
		}
	} catch (e) {
		console.log(e);
	}
};

const delay = (t, val) => {
	return new Promise(function (resolve) {
		setTimeout(function () {
			resolve(val);
		}, t);
	});
};

module.exports = {
	client,
	clearCache,
	storeGameResult,
	storeGameBegin,
	getCompletedGames,
	getLiveGames,
	trimCache,
	checkLiveGames,
};
