import React, { useEffect } from "react";
import PlayerHistoryView from "./components/PlayerHistoryView";
import LiveGameView from "./components/LiveGameView";
import { Grid, Box, Heading, Container, Text } from "theme-ui";
import { useStateValue, initGames } from "./state";
import gamesRouter from "./services/games";
import RecentGamesView from "./components/RecentGamesView";

//plan for the frontend

//link live games through cache
//implement deisgn , with a max of maybe 10 recent games
//find some icons
//refactor code
//done

const App = () => {
	const [, dispatch] = useStateValue();

	useEffect(() => {
		const initializeData = async () => {
			try {
				const data = await gamesRouter.getGames();
				if (data.length) dispatch(initGames(data));
			} catch (e) {
				console.log(e);
			}
		};
		initializeData();
	}, [dispatch]);

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
			<Heading as="h1" color="primary" style={{ textAlign: "center" }} p={3}>
				RPS-tulokset
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
					<PlayerHistoryView></PlayerHistoryView>
				</Box>
			</Grid>
		</Container>
	);
};

export default App;
