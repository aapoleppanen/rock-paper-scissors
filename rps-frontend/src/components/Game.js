import React from "react";
import { Box, Container, Text } from "theme-ui";

const Game = ({ game, player }) => {
	const aWon = game.winner === "playerA";
	let bg = player ? (aWon && game.playerA ? "win" : "lose") : "";
	bg = player && game.winner === "tie" ? "tie" : "";
	return (
		<Box
			py={3}
			px={0}
			fontSize={3}
			sx={{ borderBottom: "primary", backgroundColor: bg }}
		>
			<Container px={2} sx={{ textAlign: "center" }}>
				{game.winner ? (
					<>
						<Text sx={{ fontWeight: "700" }}>
							{aWon ? game.playerA : game.playerB}
						</Text>
						<Text> vs. {!aWon ? game.playerA : game.playerB}</Text>
					</>
				) : (
					<Text>
						{game.playerA} vs. {game.playerB}
					</Text>
				)}
			</Container>
		</Box>
	);
};

export default Game;
