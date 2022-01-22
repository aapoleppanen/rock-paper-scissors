const errorHandler = (error, req, res, next) => {
	if (error.name === "CastError") {
		return res.status(400).send({ error: "Document not found" });
	} else {
		console.log(error);
	}

	next(error);
};

module.exports = {
	errorHandler,
};
