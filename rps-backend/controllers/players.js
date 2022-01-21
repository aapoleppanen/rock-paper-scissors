const Game = require("../models/game");
const Player = require("../models/player");
const cache = require("../cache/cache");
const { formatPlayer } = require("../util/dbUtil");
const config = require("../util/config");

const playersRouter = require("express").Router();

//get players
playersRouter.get("/", async (req, res, next) => {
	try {
		const players = await Player.find();
		res.json(players);
	} catch (e) {
		next(e);
	}
});

//get player stats
playersRouter.get("/:id", async (req, res, next) => {
	try {
		const player = await Player.findById(req.params.id);
		const cachedGames = await cache.readCache();
		const playerGames = await cachedGames.filter(
			(g) => g.playerA == player.name || g.playerB == player.name
		);
		games = await Game.find(
			{
				$or: [{ playerA: player.name }, { playerB: player.name }],
			},
			{},
			{
				sort: { t: -1 },
				limit: config.PAGE_LENGTH,
			}
		);

		const playerObject = formatPlayer(player.toObject(), playerGames);
		res.json({
			...playerObject,
			games: [...games, ...playerGames],
		});
	} catch (e) {
		next(e);
	}
});

//get more games for a given player
playersRouter.get("/games/:name/:page", async (req, res, next) => {
	try {
		games = await Game.find(
			{
				$or: [{ playerA: req.params.name }, { playerB: req.params.name }],
			},
			{},
			{
				sort: { t: -1 },
				skip: req.params.page * config.PAGE_LENGTH,
				limit: config.PAGE_LENGTH,
			}
		);
		res.json({ games });
	} catch (e) {
		next(e);
	}
});

module.exports = playersRouter;
