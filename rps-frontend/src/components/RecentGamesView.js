import React from "react";
import GameList from "./GameList";
import { useStateValue } from "../state";

const RecentGamesView = () => {
	const [{ finishedGames }] = useStateValue();
	return <GameList games={finishedGames.slice(0, 10)}></GameList>;
};

export default RecentGamesView;
