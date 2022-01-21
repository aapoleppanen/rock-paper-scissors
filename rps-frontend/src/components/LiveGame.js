import React, { useEffect, useState } from "react";
import { Box, Button } from "theme-ui";

const LiveGame = ({ game }) => {
	return (
		<Box p={3} fontSize={4} bg="secondary">
			{game.playerA} vs. {game.playerB}
		</Box>
	);
};

export default LiveGame;
