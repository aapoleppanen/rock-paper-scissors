import React from "react";
import GameList from "./Game/GameList";
import { useStateValue } from "../state";
import { RECENT_LENGTH } from "../config/config";

const RecentGamesView = () => {
	const [{ completedGames }] = useStateValue();
	return <GameList games={completedGames.slice(0, RECENT_LENGTH)}></GameList>;
};

export default RecentGamesView;
