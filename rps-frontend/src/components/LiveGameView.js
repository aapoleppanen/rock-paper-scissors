import React from "react";
import { useStateValue, addGameBegin, addGameResult } from "../state";
import { useWebSocket } from "../services/liveGames";
import GameList from "./GameList";

const LiveGameView = () => {
	const [{ liveGames }, dispatch] = useStateValue();

	const handleWsUpdate = (event) => {
		try {
			const data = JSON.parse(JSON.parse(event.data));
			if (data.type === "GAME_BEGIN") dispatch(addGameBegin(data));
			//removes the game from live games and adds the result
			if (data.type === "GAME_RESULT") dispatch(addGameResult(data));
		} catch (e) {
			console.log(e);
		}
	};

	useWebSocket("message", handleWsUpdate);

	return (
		<div>
			<GameList games={liveGames}></GameList>
		</div>
	);
};

export default LiveGameView;
