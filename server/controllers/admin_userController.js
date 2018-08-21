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
		async function logAdmin(ctx) {
			let query = `select * from admin where adminname = '${ctx.params.username}' and password = '${ctx.params.pwd}';`;
			logger.trace(query);
			let getAdminPromise = new Promise((resolve, reject) => {
				db.all(query, function (err, row) {
					if (err) {
						logger.error(err);
						reject(err);
					}
		
					if (row && row.length === 1) {
						logger.trace(`Admin ${ctx.params.username} retrieved`);
						let admin = row[0];
						resolve(
							{
								status: 'ok',
								adminid: admin.adminid,
							});
					}
					else {
						logger.warn(`Unabled to log admin ${ctx.params.adminname}`);
						resolve({ status: 'nok' });
					}
				});
			});
		
			loginState = await getAdminPromise;
		
			if (loginState.status === 'ok') {
				ctx.ok(loginState);
			}
			else ctx.noContent();
		}

/*
	retrieves all users
	returns
		either users list + 'ok' status
		either 'nok' status
		*/
async function getAllUsers(ctx) {
	let query = `select userid, username, authorized from users;`;
	logger.trace(query);
	let getUsersPromise = new Promise((resolve, reject) => {
		db.all(query, function (err, row) {
			if (err) {
				logger.error(err);
				reject(err);
			}

			logger.trace(`${row.length} users retrieved`);
			resolve(
				{
					status: 'ok',
					users: row
				});
		});
	});

	let response = await getUsersPromise.catch;

	ctx.ok(response);
}


/*
		*/
async function enableUser(ctx) {
	logger.trace(`Refresh token ${ctx.request.body.token} for userid ${ctx.request.body.userid}`);
	let promise;
	promise = new Promise((resolve, reject) => {
		db.all(`select * from admin where adminid = '${ctx.request.body.adminid}' and password = '${ctx.request.body.password}';`, function (err, row) {
			if (err) {
				logger.error(err);
				reject(err);
			}

			logger.debug(row)
			if (row && row.length === 1) {
				resolve('nok');
			}

		});
	});

	let status;
	try {
		status = await promise;
	}
	catch (e) {
		logger.error(e);
	}

	if (status === 'ok') {
		promise = new Promise((resolve, reject) => {
			db.run(`update users set authorized = 1 where userid = '${ctx.request.body.userid}'`, (err) => {
				if (err) reject(err);
				resolve('ok');
			});
		});

		status = "";
		try {
			status = await promise;
		}
		catch (e) {
			logger.error(e);
		}

		if (status === "ok")
			ctx.ok();
		else ctx.noContent();

	}
	else ctx.noContent();
	
}


module.exports = {
	logAdmin,
	getAllUsers,
	enableUser,
}