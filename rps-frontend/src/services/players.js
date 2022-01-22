import axios from "axios";
import { API_BASE_URL } from "../config/config";

const baseUrl = `${API_BASE_URL}/players`;

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
