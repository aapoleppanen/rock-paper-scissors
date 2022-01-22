export const addGameBegin = (payload) => {
	return {
		type: "ADD_GAME_BEGIN",
		payload,
	};
};

export const removeLiveGame = (payload) => {
	return {
		type: "REMOVE_LIVE_GAME",
		payload,
	};
};

export const addGameResult = (payload) => {
	return {
		type: "ADD_GAME_RESULT",
		payload,
	};
};

export const initGames = (payload) => {
	return {
		type: "INIT_GAMES",
		payload,
	};
};

export const reducer = (state, action) => {
	switch (action.type) {
		case "ADD_GAME_BEGIN":
			return {
				...state,
				liveGames: [
					...state.liveGames,
					{
						...formatGame(action.payload),
					},
				],
			};
		case "ADD_GAME_RESULT":
			const isAdded = state.completedGames.find(
				(g) => g.gameId === action.payload.gameId
			);
			if (isAdded) {
				return {
					...state,
					liveGames: state.liveGames.filter(
						(g) => g.gameId !== action.payload.gameId
					),
				};
			} else {
				const completedGames = [
					{
						...formatGame(action.payload),
					},
					...state.completedGames,
				];
				return {
					...state,
					completedGames: completedGames.slice(0, 10),
					liveGames: state.liveGames.filter(
						(g) => g.gameId !== action.payload.gameId
					),
				};
			}
		case "INIT_GAMES":
			return {
				...state,
				completedGames: [
					...state.completedGames,
					...action.payload.completedGames.reverse(),
				],
				liveGames: [...state.liveGames, ...action.payload.liveGames],
			};
		default:
			return state;
	}
};

//add this to the reducers
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

const determineWinner = (game) => {
	const [aPlayed, bPlayed] = [game.aPlayed, game.bPlayed];
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
