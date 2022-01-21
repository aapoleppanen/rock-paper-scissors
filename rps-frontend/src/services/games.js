import axios from "axios";

const baseUrl = "http://localhost:3001/api/games";

const getGames = async () => {
	const res = await axios.get(baseUrl);
	return res.data;
};

export const determineWinner = (game) => {
	const [aPlayed, bPlayed] = [game.playerA.played, game.playerB.played];
	if (aPlayed === bPlayed) {
		return "tie";
	} else if (aPlayed === "ROCK") {
		if (bPlayed === "PAPER") {
			return "playerB";
		} else {
			return "playerA";
		}
	} else if (aPlayed === "PAPER") {
		if (bPlayed === "SCISSORS") {
			return "playerB";
		} else {
			return "playerA";
		}
	} else {
		if (bPlayed === "ROCK") {
			return "playerB";
		} else {
			return "playerA";
		}
	}
};

const games = {
	getGames,
};

export default games;
