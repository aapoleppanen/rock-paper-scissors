import axios from "axios";
import { API_BASE_URL } from "../config/config";

const baseUrl = `${API_BASE_URL}/games`;

const getGames = async () => {
	const res = await axios.get(baseUrl);
	return res.data;
};

const games = {
	getGames,
};

export default games;
