const Game = require("../models/game");
const Player = require("../models/player");
const cache = require("../cache/cache");
const { formatPlayer } = require("../util/formatter");
const config = require("../config/config");

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

const getGamesInDb = async (name, page) => {
	try {
		const games = await Game.find(
			{
				$or: [{ playerA: name }, { playerB: name }],
			},
			{},
			{
				sort: { t: -1 },
				skip: page * config.PAGE_LENGTH,
				limit: config.PAGE_LENGTH,
			}
		);
		return games;
	} catch (e) {
		console.log(e);
	}
};

//get player stats
playersRouter.get("/:id", async (req, res, next) => {
	try {
		const player = await Player.findById(req.params.id);
		const cachedGames = await cache.getPlayerGames(player.name);
		const dbGames = await getGamesInDb(player.name, 0);
		//get updated player with cached game stats added
		const playerObject = formatPlayer(player.toObject(), cachedGames);
		res.json({
			...playerObject,
			//filter out possible duplicates
			games: [...cachedGames, ...dbGames].filter(
				(v, i, a) => a.findIndex((t) => t.gameId === v.gameId) === i
			),
		});
	} catch (e) {
		next(e);
	}
});

//get more games for a given player
playersRouter.get("/games/:name/:page", async (req, res, next) => {
	try {
		const games = await getGamesInDb(req.params.name, req.params.page);
		res.json({ games });
	} catch (e) {
		next(e);
	}
});

module.exports = playersRouter;
