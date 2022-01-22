import React from "react";
import { useStateValue } from "../state";
import GameList from "./Game/GameList";

const LiveGameView = () => {
	const [{ liveGames }] = useStateValue();

	return (
		<div>
			<GameList games={liveGames}></GameList>
		</div>
	);
};

export default LiveGameView;
