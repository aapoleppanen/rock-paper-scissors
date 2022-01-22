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
						...action.payload,
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
						...action.payload,
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
