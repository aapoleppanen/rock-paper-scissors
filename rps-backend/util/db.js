const fetch = require("node-fetch");
const Player = require("../models/player");
const Game = require("../models/game");
const Cursor = require("../models/cursor");
const config = require("../util/config");
const cache = require("../cache/cache");

const { formatGame, formatPlayer, findPlayer } = require("./dbUtil");

//keep track of cursors and sort the games by time
//do this in order to not lose games when api page updates
const syncDatabase = async () => {
	console.log("syncing database...");
	let [x, lim, cursor, games] = [0, 500, "/rps/history", []];
	//get the last cursor and gameId
	last = await Cursor.findById(config.CURSOR_ID);
	let newLast = last.cursor;
	while (x < lim && cursor) {
		try {
			const response = await fetch(`${config.API_URI}${cursor}`);
			const gamesJson = await response.json();
			games = games.concat(gamesJson.data);
			//add one more cycle to ensure no games are dropped
			if (cursor === last.cursor) break;
			cursor = gamesJson.cursor;
			if (x === 0) newLast = cursor;
		} catch (e) {
			console.log(e);
			return;
		}
		x++;
	}
	console.log(`handling ${games.length} games`);
	//sort games according to timestamp in DESC. order
	games = games.sort((a, b) => b.t - a.t);
	await addToDataBase(games, last.gameId);
	console.log("clearing cache...");
	await cache.trimCache();
	await Cursor.findByIdAndUpdate(config.CURSOR_ID, {
		cursor: newLast,
		gameId: games[0].gameId,
	});
	console.log("sync complete");
};

const addToDataBase = async (games, lastGameId) => {
	try {
		//format games to be in database format
		const { gameModels, playerModels } = await handleGames(games, lastGameId);
		await Player.bulkSave(playerModels);
		await Game.bulkSave(gameModels);
		console.log(
			`Database updated succesfully with ${gameModels.length} new games`
		);
	} catch (e) {
		console.log(e);
	}
};

//rewrite to have all models in the same bulk

//implement a simple redis cache

//implement a function which cross references
//both redis and rps/history to not lose data
//this will also clear the redis cache

//plan for this
//setinterval cursor update function for api/history
//when syncdatabase is called the games are cross-referenced
//cache, and then pushed to the db
//redis can be cleared after succesfull push w/ clearcache()

//websockets game_begin (search if user needs to be added)
//ws implemented with ws for node
//if this is the case add the user to mongo manual override
//games get pushed to redis
//recent games can be read from redis cache //sure

//push data to mongo every 2-5minutes

///last game: 1642692929896
//first game: 1642692686189
//1000000

//8fe4e23e5731fa610fc3e1
//8fe4e23e5731fa610fc3e1
// /rps/history?cursor=-2TOo_SC4ft4
//ref 1642688590049

const handleGames = async (games, lastGameId) => {
	let gameModels = [];
	//save formatted games to use for player formatting
	let fGames = [];
	let playerModels = [];
	for (let g of games) {
		//check for duplicate games
		try {
			if (lastGameId === g.gameId) {
				break;
			}
		} catch (e) {
			console.log(e);
			return;
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
		//to the database
		let player = await findPlayer(p);
		//add the statistic of the player over batch of pGames
		//to the player stats
		player = formatPlayer(player, pGames);

		playerModels.push(player);
	}
	return playerModels;
};

// const initPlayers = async (games) => {
// 	const players = await Game.distinctaw;
// };

module.exports = {
	syncDatabase,
	handlePlayers,
};
