const mongoose = require("mongoose");

const cursorSchema = new mongoose.Schema({
	cursor: {
		type: String,
		required: true,
	},
	gameId: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Cursor", cursorSchema);
