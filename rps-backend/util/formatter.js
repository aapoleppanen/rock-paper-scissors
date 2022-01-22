const Player = require("../models/player");

const determineWinner = (game) => {
	if (game.aPlayed === game.bPlayed) {
		return "tie";
	} else if (game.aPlayed === "ROCK") {
		if (game.bPlayed === "PAPER") {
			return "playerB";
		} else {
			return "playerA";
		}
	} else if (game.aPlayed === "PAPER") {
		if (game.bPlayed === "SCISSORS") {
			return "playerB";
		} else {
			return "playerA";
		}
	} else {
		if (game.bPlayed === "ROCK") {
			return "playerB";
		} else {
			return "playerA";
		}
	}
};

const formatGame = (g) => {
	const fg = {
		gameId: g.gameId,
		playerA: g.playerA.name,
		playerB: g.playerB.name,
		t: g.t,
	};
	if (g.type && g.type === "GAME_BEGIN") {
		return fg;
	} else {
		return {
			...fg,
			aPlayed: g.playerA.played,
			bPlayed: g.playerB.played,
			winner: determineWinner({
				...fg,
				aPlayed: g.playerA.played,
				bPlayed: g.playerB.played,
			}),
		};
	}
};

const formatPlayer = (player, pGames) => {
	player.wins =
		player.wins +
		pGames.filter(
			(g) =>
				(g.playerA === player.name && determineWinner(g) === "playerA") ||
				(g.playerB === player.name && determineWinner(g) === "playerB")
		).length;
	player.gameCount = player.gameCount + pGames.length;
	player.handsPlayed = {
		scissors:
			player.handsPlayed.scissors +
			pGames.filter(
				(g) =>
					(g.playerA === player.name && g.aPlayed === "SCISSORS") ||
					(g.playerB === player.name && g.bPlayed === "SCISSORS")
			).length,
		rock:
			player.handsPlayed.rock +
			pGames.filter(
				(g) =>
					(g.playerA === player.name && g.aPlayed === "ROCK") ||
					(g.playerB === player.name && g.bPlayed === "ROCK")
			).length,
		paper:
			player.handsPlayed.paper +
			pGames.filter(
				(g) =>
					(g.playerA === player.name && g.aPlayed === "PAPER") ||
					(g.playerB === player.name && g.bPlayed === "PAPER")
			).length,
	};
	return player;
};

const playerDefaults = {
	gameCount: 0,
	wins: 0,
	handsPlayed: {
		scissors: 0,
		rock: 0,
		paper: 0,
	},
};

const findPlayer = async (name) => {
	try {
		let player = await Player.findOne({
			name,
		});
		//if player is not found create a new one to the database
		if (!player) {
			player = await new Player({ ...playerDefaults, name });
		}
		return player;
	} catch (e) {
		console.log(e);
		return;
	}
};

module.exports = {
	determineWinner,
	formatGame,
	formatPlayer,
	playerDefaults,
	findPlayer,
};
