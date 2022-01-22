const Player = require("../models/player");
const Game = require("../models/game");
const config = require("../config/config");
const cache = require("../cache/cache");
const history = require("./history");
const Cursor = require("../models/cursor");

const { formatGame, formatPlayer, findPlayer } = require("../util/formatter");

//keep track of cursors and sort the games by time
//do this in order to not lose games when api page updates
const syncDatabase = async () => {
	console.log("syncing database...");
	const [games, newLastCursor] = await history.getNewGames();
	console.log(`handling ${games.length} games`);
	await addToDataBase(games);
	console.log("trimming cache...");
	await cache.trimCache();
	//update the last cursor and game value
	await Cursor.findByIdAndUpdate(config.CURSOR_ID, {
		cursor: newLastCursor,
		gameId: games[0].gameId,
	});
	console.log("sync complete");
};

const addToDataBase = async (games) => {
	try {
		//format games to be in database format
		const { gameModels, playerModels } = await handleGames(games);
		await Player.bulkSave(playerModels);
		await Game.bulkSave(gameModels);
		console.log(
			`Database updated succesfully with ${gameModels.length} new games`
		);
	} catch (e) {
		console.log(e);
	}
};

const handleGames = async (games) => {
	let gameModels = [];
	//save formatted games to use for player formatting
	let fGames = [];
	let playerModels = [];
	const last = await Cursor.findById(config.CURSOR_ID);
	for (let g of games) {
		//check for duplicate games
		if (last.gameId === g.gameId) {
			break;
		}
		const fGame = formatGame(g);
		const newGame = new Game(fGame);
		fGames.push(fGame);
		gameModels.push(newGame);
	}
	//use the formatted games to handleplayer updates
	playerModels = await handlePlayers(fGames);

	return {
		gameModels,
		playerModels,
	};
};

const handlePlayers = async (games) => {
	const players = [
		...new Set(games.reduce((a, g) => [...a, g.playerA, g.playerB], [])),
	];
	let playerModels = [];
	for (let p of players) {
		const pGames = games.filter((g) => g.playerA == p || g.playerB == p);
		//find the player in the database
		//if they do not exist create the player with default values
		let player = await findPlayer(p);
		//add the statistic of the player over batch of pGames
		//to the player stats
		player = formatPlayer(player, pGames);

		playerModels.push(player);
	}
	return playerModels;
};

module.exports = {
	syncDatabase,
};
