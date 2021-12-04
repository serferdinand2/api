const express = require('express');
const app = express();

const config = require('./env');
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${config.mongo.user}:${config.mongo.password}@stage.w4tez.mongodb.net/surveyplanet?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const usersCollection = client.db('surveyplanet').collection('users');

app.set('client', client);

const homeRoute = require('./routes/index');
const aboutRoute = require('./routes/about');
const userRoute = require('./routes/users');

app.use('/', homeRoute());
app.use('/about', aboutRoute());
app.use('/user', userRoute());

module.exports = app;
