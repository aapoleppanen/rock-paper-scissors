import React, { useEffect } from "react";
import PlayerSelect from "./components/Player/PlayerSelect";
import LiveGameView from "./components/LiveGameView";
import { Grid, Box, Heading, Container, Text } from "theme-ui";
import { useStateValue, initGames, addGameBegin, addGameResult } from "./state";
import gamesRouter from "./services/games";
import RecentGamesView from "./components/RecentGamesView";
import { useWebSocket } from "./services/liveGames";

const App = () => {
	const [, dispatch] = useStateValue();

	useEffect(() => {
		const initializeData = async () => {
			try {
				const data = await gamesRouter.getGames();
				if (data) dispatch(initGames(data));
			} catch (e) {
				console.log(e);
			}
		};
		initializeData();
	}, [dispatch]);

	//handle websocket updates
	const handleWsUpdate = (event) => {
		try {
			const data = JSON.parse(event.data);
			if (data.type === "GAME_BEGIN") dispatch(addGameBegin(data));
			if (data.type === "GAME_RESULT") dispatch(addGameResult(data));
		} catch (e) {
			console.log(e);
		}
	};

	useWebSocket("message", handleWsUpdate);

	return (
		<Container
			px={"5vw"}
			bg="secondary"
			style={{
				minHeight: "100vh",
				alignItems: "center",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Heading
				as="h1"
				color="primary"
				style={{ textAlign: "center", fontWeight: "300" }}
				p={3}
			>
				RPS-RESULTS
			</Heading>
			<Grid
				gap={0}
				columns={[1, 2, 3]}
				sx={{ justifyItems: "center", maxWidth: "1260px" }}
			>
				<Box variant={"primaryBox"} my={[2, null, null]}>
					<Container
						p={2}
						sx={{
							borderBottom: "primary",
							height: "46px",
						}}
						variant="centered"
					>
						<Text>LIVE GAMES</Text>
					</Container>
					<LiveGameView></LiveGameView>
				</Box>
				<Box variant={"primaryBox"} my={[2, null, null]}>
					<Container
						p={2}
						sx={{
							borderBottom: "primary",
							height: "46px",
						}}
						variant="centered"
					>
						<Text>RECENT GAMES</Text>
					</Container>
					<RecentGamesView></RecentGamesView>
				</Box>
				<Box variant={"primaryBox"} my={[2, null, null]}>
					<PlayerSelect></PlayerSelect>
				</Box>
			</Grid>
		</Container>
	);
};

export default App;
