const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
	gameId: {
		type: String,
		required: true,
	},
	playerA: {
		type: String,
	},
	playerB: {
		type: String,
	},
	aPlayed: {
		type: String,
	},
	bPlayed: {
		type: String,
	},
	winner: {
		type: String,
		required: true,
	},
	t: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("Game", gameSchema);
