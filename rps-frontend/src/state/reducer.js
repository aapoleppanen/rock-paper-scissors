import { determineWinner } from "../services/games";

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
						gameId: action.payload.gameId,
						playerA: action.payload.playerA.name,
						playerB: action.payload.playerB.name,
						t: action.payload.t,
					},
				],
			};
		case "ADD_GAME_RESULT":
			const winner = determineWinner(action.payload);
			return {
				...state,
				finishedGames: [
					{
						gameId: action.payload.gameId,
						playerA: action.payload.playerA.name,
						playerB: action.payload.playerB.name,
						aPlayed: action.payload.playerA.played,
						bplayed: action.payload.playerB.played,
						t: action.payload.t,
						winner,
					},
					...state.finishedGames,
				],
				liveGames: state.liveGames.filter(
					(g) => g.gameId !== action.payload.gameId
				),
			};
		case "INIT_GAMES":
			return {
				...state,
				finishedGames: [...state.finishedGames, ...action.payload],
			};
		default:
			return state;
	}
};
