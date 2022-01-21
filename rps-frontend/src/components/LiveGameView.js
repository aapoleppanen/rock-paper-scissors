import React from "react";
import { useStateValue, addGameBegin, addGameResult } from "../state";
import { useWebSocket } from "../services/liveGames";
import GameList from "./GameList";

const LiveGameView = () => {
	const [{ liveGames }, dispatch] = useStateValue();
	//put this into another file
	//switch statement for dealing with the event type
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
			{/* <Grid gap={2} columns={[1]}>
				{finishedGames.map((g) => (
					<Box p={3} fontSize={4} bg="secondary" key={g.gameId}>
						{g.gameId}
					</Box>
				))}
			</Grid> */}
		</div>
	);
};

export default LiveGameView;
