require("dotenv").config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const SECRET = process.env.SECRET;
const REDIS_URI = process.env.REDIS_URI;
const CURSOR_ID = process.env.CURSOR_ID;
const WS_URI = process.env.WS_URI;
const API_URI = process.env.API_URI;
const DEFAULT_CURSOR = process.env.DEFAULT_CURSOR;

const CACHE_LENGTH = 10;
const PAGE_LENGTH = 25;

const PAGE_LIMIT = 500;

const LIVE_GAME_CHECK_INTERVAL = 30 * 1000;

module.exports = {
	PORT,
	MONGO_URI,
	SECRET,
	REDIS_URI,
	CURSOR_ID,
	WS_URI,
	API_URI,
	CACHE_LENGTH,
	PAGE_LENGTH,
	LIVE_GAME_CHECK_INTERVAL,
	DEFAULT_CURSOR,
	PAGE_LIMIT,
};
