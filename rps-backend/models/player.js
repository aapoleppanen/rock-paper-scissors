const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	gameCount: {
		type: Number,
		required: true,
	},
	wins: {
		type: Number,
		required: true,
	},
	handsPlayed: {
		scissors: Number,
		rock: Number,
		paper: Number,
	},
});

module.exports = mongoose.model("Player", playerSchema);
