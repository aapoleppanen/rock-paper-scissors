const fs = require("fs");

const clearCollections = async () => {
	try {
		await Player.deleteMany();
		await Game.deleteMany();
		console.log("collections cleared");
	} catch (e) {
		console.log(e);
	}
};

//code used for importing the data haha
const initDatabase = async () => {
	fs.readFile("./localdata/games0.txt", async (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		const jsonData = JSON.parse(data);
		console.log(jsonData.length);
		let games = [];
		for (let f of jsonData) {
			games = games.concat(f.data);
		}
		await addToDataBase(games);
		console.log("done");
	});
};

//init for players
const initDatabase = async () => {
	await initPlayers();
};

const initPlayers = async () => {
	const playerA = await Game.distinct("playerA");
	const playerB = await Game.distinct("playerB");
	const players = [...new Set([...playerA, ...playerB])];
	for (let p of players) {
		await initPlayer(p);
	}
};

const initPlayer = async (playerName) => {
	const playerGames = await Game.find({
		$or: [{ playerA: playerName }, { playerB: playerName }],
	});
	player = await new Player({ ...playerDefaults, name: playerName });
	player = formatPlayer(player, playerGames);
	await player.save();
	console.log(playerName + " saved");
};

//init here

const addToDatabase = async (games) => {
	for (let g of games) {
		//check if game already exists
		if (
			await Game.findOne({
				gameId: g.gameId,
			})
		) {
			continue;
		}

		//handle new possible players
		let playerA = await Player.findOne({
			name: g.playerA.name,
		});
		let playerB = await Player.findOne({
			name: g.playerB.name,
		});

		if (!playerA) {
			const newPlayer = new Player({
				name: g.playerA.name,
				gameCount: 0,
				wins: 0,
				handsPlayed: {
					scissors: 0,
					rock: 0,
					paper: 0,
				},
			});
			await newPlayer.save();
			playerA = newPlayer;
		}
		if (!playerB) {
			const newPlayer = new Player({
				name: g.playerB.name,
				gameCount: 0,
				wins: 0,
				handsPlayed: {
					scissors: 0,
					rock: 0,
					paper: 0,
				},
			});
			await newPlayer.save();
			playerB = newPlayer;
		}

		const winner = determineWinner(g);
		//handle games
		const newGame = new Game({
			gameId: g.gameId,
			playerA: playerA._id,
			playerB: playerB._id,
			handsPlayed: {
				playerA: g.playerA.played,
				playerB: g.playerB.played,
			},
			winner,
		});
		await newGame.save();

		const updatedPlayerA = {
			name: playerA.name,
			gameCount: playerA.gameCount + 1,
			wins: winner === "playerA" ? playerA.wins + 1 : playerA.wins,
			handsPlayed: {
				scissors:
					g.playerA.played === "SCISSORS"
						? playerA.handsPlayed.scissors + 1
						: playerA.handsPlayed.scissors,
				rock:
					g.playerA.played === "ROCK"
						? playerA.handsPlayed.rock + 1
						: playerA.handsPlayed.rock,
				paper:
					g.playerA.played === "PAPER"
						? playerA.handsPlayed.paper + 1
						: playerA.handsPlayed.paper,
			},
			games: playerA.games.concat(newGame._id),
		};
		await Player.findByIdAndUpdate(playerA._id, updatedPlayerA);

		const updatedPlayerB = {
			name: playerB.name,
			gameCount: playerB.gameCount + 1,
			wins: winner === "playerB" ? playerB.wins + 1 : playerB.wins,
			handsPlayed: {
				scissors:
					g.playerB.played === "SCISSORS"
						? playerB.handsPlayed.scissors + 1
						: playerB.handsPlayed.scissors,
				rock:
					g.playerB.played === "ROCK"
						? playerB.handsPlayed.rock + 1
						: playerB.handsPlayed.rock,
				paper:
					g.playerB.played === "PAPER"
						? playerB.handsPlayed.paper + 1
						: playerB.handsPlayed.paper,
			},
			games: playerB.games.concat(newGame._id),
		};
		await Player.findByIdAndUpdate(playerB._id, updatedPlayerB);
	}
	console.log(`Succesfully pushed ${games.length} games to MongoDB`);
};

const gamesFromCache = await cache.readCache();
console.log(gamesFromCache);
const gameIds = games.map((g) => g.gameId);
const gamesWithoutDuplicates = games.concat(
	gamesFromCache.filter((d) => gameIds.indexOf(d.gameId) < 0)
);
console.log(gamesFromCache.length);
console.log(games.length);
console.log(gamesWithoutDuplicates.length);

// const initalizeDatabase = async () => {
// 	//initialize database with data
// 	let lim = 1;
// 	let x = 0;
// 	let games = [];
// 	let cursor = "/rps/history";
// 	console.log("Started database initialization");
// 	while (x < lim) {
// 		const gamesResponse = await fetch(`${baseUrl}${cursor}`);
// 		const gamesJson = await gamesResponse.json();
// 		games = games.concat(gamesJson.data);
// 		if (!gamesJson.cursor || x === lim - 1) {
// 			syncDatabase(games);
// 			x = lim;
// 		}
// 		cursor = gamesJson.cursor;
// 		x++;
// 	}
// };
