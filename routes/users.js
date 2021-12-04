const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

module.exports = function () {
	router.get('/all', async (request, response, next) => {
		const client = request.app.get('client');
		const usersCollection = client.db('surveyplanet').collection('users');

		const limit = 10;

		let users,
			query = {};

		if (ObjectId.isValid(request.query.after)) {
			query = {
				_id: {
					$gt: ObjectId(request.query.after),
				},
			};
		}

		try {
			users = await usersCollection.find(query).limit(limit).toArray();
		} catch (err) {
			return Promise.reject(err);
		}

		response.json(users || []);
	});
	router.get('/:id', async (request, response, next) => {
		const client = request.app.get('client');
		const usersCollection = client.db('surveyplanet').collection('users');

		if (!ObjectId.isValid(request.params.id)) {
			return response.status(404).send('Not Found');
		}

		const query = {
			_id: ObjectId(request.params.id),
		};

		let user;

		try {
			user = await usersCollection.findOne(query);
		} catch (err) {
			next(err);
		}

		response.json(user);
	});

	return router;
};
