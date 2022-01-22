import React from "react";
import { Box, Container, Text, Image } from "theme-ui";
import gif from "../theme/rps.gif";
import PAPER from "../theme/wave.png";
import ROCK from "../theme/rock.png";
import SCISSORS from "../theme/scissors.png";

const Game = ({ game, player }) => {
	const [winnerName, loserName, winnerPlayed, loserPlayed] =
		game.winner === "playerA"
			? [game.playerA, game.playerB, game.aPlayed, game.bPlayed]
			: [game.playerB, game.playerA, game.bPlayed, game.aPlayed];

	const bgCol = (() => {
		if (!player) return "";
		else if (game.winner === "tie") return "tie";
		else if (winnerName === player.name) return "win";
		else return "lose";
	})();

	const icons = { PAPER, ROCK, SCISSORS };

	//Fist by Cristiano Zoucas from NounProject.com
	//Scissors by Cristiano Zoucas from NounProject.com and also Wave

	return (
		<Box
			px={0}
			fontSize={3}
			sx={{ borderBottom: "primary", height: "53px" }}
			variant={"centered"}
			bg={bgCol}
		>
			<Container px={2} sx={{ textAlign: "center" }} variant={"centered"}>
				{game.winner ? (
					<>
						<Text
							sx={
								!player && game.winner !== "tie"
									? { fontWeight: "700", textDecoration: "underline" }
									: {}
							}
						>
							{winnerName}{" "}
						</Text>
						<Image
							src={icons[winnerPlayed]}
							alt=""
							style={{ width: "auto", height: "25px" }}
							m={1}
						/>
						<Image
							src={icons[loserPlayed]}
							alt=""
							style={{
								width: "auto",
								height: "25px",
								transform: "scaleX(-1)",
							}}
							m={1}
						/>
						<Text> {loserName} </Text>
					</>
				) : (
					<>
						<Text>{game.playerA}</Text>
						<Image src={gif} style={{ width: "53px", height: "40px" }} alt="" />
						<Text>{game.playerB}</Text>
					</>
				)}
			</Container>
		</Box>
	);
};

export default Game;
