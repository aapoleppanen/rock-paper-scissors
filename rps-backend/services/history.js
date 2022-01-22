const fetch = require("node-fetch");
const config = require("../config/config");
const Cursor = require("../models/cursor");

const getHistory = async (cursor) => {
	const res = await fetch(`${config.API_URI}${cursor}`);
	return await res.json();
};

const getNewGames = async () => {
	let [x, lim, cursor, games] = [
		0,
		config.PAGE_LIMIT,
		config.DEFAULT_CURSOR,
		[],
	];
	//get the last cursor and gameId
	last = await Cursor.findById(config.CURSOR_ID);
	let newLastCursor = last.cursor;
	while (x < lim && cursor) {
		try {
			const res = await getHistory(cursor);
			games = games.concat(res.data);
			//add one more cycle to ensure no games are dropped
			if (cursor === last.cursor) break;
			cursor = res.cursor;
			if (x === 0) newLastCursor = cursor;
		} catch (e) {
			console.log(e);
			return;
		}
		x++;
	}
	games = games.sort((a, b) => b.t - a.t);
	return [games, newLastCursor];
};

module.exports = {
	getHistory,
	getNewGames,
};
