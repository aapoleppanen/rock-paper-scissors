const cache = require("../cache/cache");

const gamesRouter = require("express").Router();

gamesRouter.get("/", async (req, res, next) => {
	//list recently finished games
	try {
		const completedGames = await cache.getCompletedGames();
		const liveGames = await cache.getLiveGames();
		res.json({ completedGames, liveGames });
	} catch (e) {
		next(e);
	}
});

module.exports = gamesRouter;
