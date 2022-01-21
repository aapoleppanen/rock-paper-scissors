const cache = require("../cache/cache");

const gamesRouter = require("express").Router();

gamesRouter.get("/", async (req, res, next) => {
	//list recently finished games
	try {
		const cachedGames = await cache.readCache();
		res.json(cachedGames);
	} catch (e) {
		next(e);
	}
});

module.exports = gamesRouter;
