import React from "react";
import { useStateValue } from "../state";

const GameHistoryView = () => {
	const [{ liveGames }, dispatch] = useStateValue();

	return (
		<div>
			<ul>
				{liveGames.map((g) => (
					<li key={g.gameId}>
						<p>
							{g.playerA} vs. {g.playerB}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default GameHistoryView;
