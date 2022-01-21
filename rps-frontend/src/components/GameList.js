import React from "react";
import { Container } from "theme-ui";
import Game from "./Game";

//const page size
const GameList = ({ games, hasPlayer }) => {
	return (
		<Container>
			{games.map((g, i) => (
				<Game
					game={g}
					lastkey={g.gameId}
					key={g.gameId}
					player={hasPlayer}
				></Game>
			))}
		</Container>
	);
};

export default GameList;
