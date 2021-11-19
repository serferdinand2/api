const express = require('express');
const app = express();

const config = require('./env');
const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${config.mongo.user}:${config.mongo.password}@stage.w4tez.mongodb.net/surveyplanet?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const usersCollection = client.db('surveyplanet').collection('users');

app.get('/', (request, response, next) => {
	response.render('index.html');
});

app.get('/about', (request, response, next) => {
	response.sendFile(`${__dirname}/static/about.html`);
});

app.get('/user/:id', async (request, response, next) => {
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

app.get('/users', async (request, response, next) => {
	const limit = 10;

	let query = {};

	if (ObjectId.isValid(request.query.after)) {
		query = {
			_id: {
				$gt: ObjectId(request.query.after),
			},
		};
	}

	console.log(test);

	let users;

	try {
		users = await usersCollection.find(query).limit(limit).toArray();
	} catch (err) {
		return Promise.reject(err);
	}

	response.json(users || []);
});

(async function () {
	await client.connect();

	app.listen(8080, () => {
		console.log('API running on port 8080');
	});
})();
module.exports = app;
