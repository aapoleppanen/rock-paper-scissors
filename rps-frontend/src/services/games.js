import axios from "axios";

const baseUrl = "http://localhost:3001/api/games";

const getGames = async () => {
	const res = await axios.get(baseUrl);
	return res.data;
};

const games = {
	getGames,
};

export default games;
