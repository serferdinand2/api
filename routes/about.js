const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = function () {
	router.get('/', (request, response, next) => {
		const about = path.resolve(__dirname, '../static/about.html');
		response.sendFile(about);
	});

	return router;
};
