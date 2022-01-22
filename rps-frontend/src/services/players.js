import axios from "axios";
const baseUrl = "http://localhost:3001/api/players";

const getPlayerStats = async (id) => {
	const res = await axios.get(`${baseUrl}/${id}`);
	return res.data;
};

const getPlayers = async () => {
	const res = await axios.get(`${baseUrl}`);
	return res.data;
};

const getPlayersGames = async (name, page) => {
	const res = await axios.get(`${baseUrl}/games/${name}/${page}`);
	return res.data;
};

const players = {
	getPlayerStats,
	getPlayers,
	getPlayersGames,
};

export default players;
