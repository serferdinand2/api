const httpShutdown = require('http-shutdown');
const app = require('./app');
const client = app.get('client');
const PORT = 8080;

let server;

function serverErrorHandler(error) {
	if (error.code === 'EACESS') {
		console.error('Permission denied');
		process.exit(1);
	} else if (error.code === 'EADORINUSE') {
		console.log('Port is already in use');
		process.exit(1);
	} else {
		console.error(error);
		process.exit(1);
	}
}
function serverListeningHandler() {
	console.log(`Server listening on port ${PORT}`);
}
function sigintHandler() {
	console.error('SIGINT (C-c) shutdown');
	shutdown();
}
function sigtermHandler() {
	console.error('SIGTERM shutdown');
	shutdown();
}

function shutdown() {
	if (!server) {
		return process.exit(1);
	}
	server.shutdown(function (err) {
		if (err) {
			console.error('shutdown failed;', err.message);
			process.exit(1);
		}
		if (client) {
			client.close();
		}
		process.exit(0);
	});
}

(async function () {
	await client.connect();

	server = httpShutdown(app.listen(PORT));

	server.on('error', serverErrorHandler);
	server.on('listening', serverListeningHandler);

	process.on('SIGINT', sigintHandler);
	process.on('SIGTERM', sigtermHandler);
})();
