import React, { useEffect, useState, useCallback } from "react";
import playerService from "../services/players";
import { Text, Container, Button } from "theme-ui";
import GameList from "./GameList";
import { useStateValue } from "../state";

const PlayerHistory = ({ id }) => {
	const [player, setPlayer] = useState();
	const [page, setPage] = useState(0);
	const [lastUpdate, setLastUpdate] = useState();
	const [{ completedGames }] = useStateValue();

	const getPlayer = useCallback(
		async (isNew) => {
			const data = await playerService.getPlayerStats(id);
			if (data) {
				const newPlayer = isNew
					? { ...data, games: [data.games] }
					: { ...data, games: [...new Set([data.games, ...player.games])] };
				setPlayer(newPlayer);
			}
		},
		[id, player]
	);

	useEffect(() => {
		try {
			if (id.length) {
				getPlayer(true);
			}
		} catch (e) {
			console.log(e);
		}
	}, [id]);

	useEffect(() => {
		try {
			if (player) {
				const newestGame = completedGames.slice(0, 1)[0];
				if (
					(newestGame.playerA === player.name ||
						newestGame.playerB === player.name) &&
					lastUpdate !== newestGame.gameId
				) {
					getPlayer(false);
					setLastUpdate(newestGame.gameId);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}, [completedGames, getPlayer, lastUpdate, player]);

	const getMore = async () => {
		try {
			setPage(page + 1);
			const data = await playerService.getPlayersGames(
				player.name.replace(/\s/g, "%20"),
				page + 1
			);
			const updatedPlayer = { ...player, games: [...player.games, data.games] };
			if (data) setPlayer(updatedPlayer);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div>
			{!player ? (
				<div></div>
			) : (
				<>
					<Container p={2}>
						<Container p={2}>
							<Text sx={{ fontSize: 5 }}>{player.name}</Text>
						</Container>
						<Container p={1}>
							<Text>
								Win ratio | {(player.wins / player.gameCount).toFixed(3)} {"\n"}
							</Text>
						</Container>
						<Container p={1}>
							<Text>Played | {player.gameCount}</Text>
						</Container>
						<Container p={1}>
							<Text>
								{" "}
								Most played hand |{" "}
								{Object.keys(player.handsPlayed)
									.reduce((a, e) =>
										player.handsPlayed[a] > player.handsPlayed[e] ? a : e
									)
									.toUpperCase()}
							</Text>
						</Container>
					</Container>
					<Container
						sx={{
							borderBottom: "primary",
							borderRadius: "0 0 12px 12px",
						}}
					>
						<Container
							py={3}
							variant={"centered"}
							sx={{ borderBottom: "primary" }}
						>
							<Text> Recently Played</Text>
						</Container>
						<Container
							sx={{
								overflow: "scroll",
								height: "446px",
								borderRadius: "0 0 12px 12px",
								zIndex: -3,
							}}
						>
							{player.games.map((g, i) => (
								<GameList
									games={g}
									key={i + g[0].gameId}
									hasPlayer={player}
								></GameList>
							))}
							<Container py={3} variant={"centered"}>
								<Button px={5} sx={{ cursor: "pointer" }} onClick={getMore}>
									Get More
								</Button>
							</Container>
						</Container>
					</Container>
				</>
			)}
		</div>
	);
};

export default PlayerHistory;
