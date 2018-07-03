const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');
const logger = require('../libs/logger.js');
const tokenCtrl = require('./tokenController.js');

/*
	retrieves username & password details
	returns
		either user's details + 'ok' status
		either 'nok' status
		*/
async function logUser(ctx) {
	logger.trace(`Logging user ${ctx.params.username}`);
	let promise = new Promise((resolve, reject) => {
		db.all(`select * from users where username = '${ctx.params.username}' and password = '${ctx.params.pwd}';`, function (err, row) {
			if (err) {
				logger.error(err);
				reject(err);
			}

			if (row && row.length === 1) {
				logger.trace(`User ${ctx.params.username} logged`);
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

	let res;
	try {
		loginState = await promise;
		if (loginState.status === 'ok') {
			ctx.params.userid = loginState.userid;
			tokenState = await tokenCtrl.createToken(ctx);
			res = { userid: loginState.userid, token: tokenState.token, color: loginState.color };
		}
	}
	catch (e) {
		logger.error(e);
	}
	
	if (res !== undefined && res.userid !== undefined)
		ctx.ok(res);
	else
		ctx.noContent();
}

/*
	checks that a given username is free
	returns
		either 'ok' status
		either 'nok' status
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
		TODO
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