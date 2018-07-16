const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');
const logger = require('../libs/logger.js');
const http = require('http');

/*
	retrieves username & password details
	returns
		either user's details + 'ok' status
		either 'nok' status
		*/
async function logUser(ctx) {
	logger.trace(`Logging user ${ctx.params.username}`);
	let getUserPromise = new Promise((resolve, reject) => {
		db.all(`select * from users where username = '${ctx.params.username}' and password = '${ctx.params.pwd}';`, function (err, row) {
			if (err) {
				logger.error(err);
				reject(err);
			}

			if (row && row.length === 1) {
				logger.trace(`User ${ctx.params.username} retrieved`);
				let user = row[0];
				resolve(
					{
						status: 'ok',
						userid: user.userid,
						color: user.color,
					});
			}
			else {
				logger.warn(`Unabled to log user ${ctx.params.username}`);
				resolve({ status: 'nok' });
			}
		});
	});

	loginState = await getUserPromise;
	
	if (loginState.status === 'ok')
	{
		let getTokenPromise = new Promise((resolve, reject) => {
			try {
				let putData = JSON.stringify({ userid: loginState.userid });
	
				if (loginState.status === 'ok') {
	
					var options = {
						hostname: 'localhost',
						port: 8068,
						path: '/tokens',
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json;charset=UTF-8',
							'Content-Length': Buffer.byteLength(putData),
						},
					};
	
					var req = http.request(options, function (res) {
						res.setEncoding('utf8');
						res.on('data', function (chunk) {
							logger.trace('BODY: ' + JSON.parse(chunk).token);
	
							resolve({ userid: loginState.userid, token: JSON.parse(chunk).token, color: loginState.color });
						});
					});
	
					req.on('error', (e) => {
						console.error(`problem with request: ${e.message}`);
						reject(e);
					});
	
					req.write(putData);
					req.end();
				}
			}
			catch (e) {
				logger.error(e);
				reject(e);
			}
		});
	
		let response = await getTokenPromise.catch((err) => {
			logger.error(err);
			ctx.noContent();
		 });
	
		 ctx.ok(response);
	}
	else ctx.noContent();

}

/*
	checks that a given username is free
	returns
		either 200 status if username is free
		either 204 status if username is not free
		*/
async function checkUser(ctx) {
	if (await getUsername(ctx.params.username))
		ctx.ok();
	else
		ctx.noContent();
}

/*
	records a username + password
	generates a random color for this user
	returns
		either 200 status if creation ok
		either 204 status if creation not ok
		*/
async function createUser(ctx) {
	if (await getUsername(ctx.request.body.username)) {
		let randomColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
		db.run(`insert into users values(null, '${ctx.request.body.username}', '${ctx.request.body.pwd}', '${randomColor}')`);
		ctx.ok();
	}
	else {
		ctx.noContent();
	}
}

function getUsername(username) {
	let promise = new Promise((resolve, reject) => {
		db.all(`select * from users where username = '${username}';`, function (err, row) {
			if (err) {
				console.dir(err)
				throw (err);
			}

			if (row.length === 0)
				resolve(true);
			else
				resolve(false);
		});
	})
	return promise;
}


module.exports = {
	logUser,
	checkUser,
	createUser,
}