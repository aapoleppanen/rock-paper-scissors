import React from "react";
import GameList from "./GameList";
import { useStateValue } from "../state";

const RecentGamesView = () => {
	const [{ completedGames }] = useStateValue();
	return <GameList games={completedGames.slice(0, 10)}></GameList>;
};

export default RecentGamesView;
