const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');
const logger = require('../libs/logger.js');

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
			logger.debug(row);
			resolve(
				{
					status: 'ok',
					users: row
				});
		});
	});

	let response = await getUsersPromise.catch(err => {
		logger.error(`Error executing ${query}`);
		ctx.noContent();
	});
	ctx.ok(response);
}


/*
	enable a user, given his userid
	TODO : add admin's token check
		*/
async function enableUser(ctx) {

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

async function disableUser(ctx) {
	promise = new Promise((resolve, reject) => {
		db.run(`update users set authorized = 0 where userid = '${ctx.request.body.userid}'`, (err) => {
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

module.exports = {
	logAdmin,
	getAllUsers,
	enableUser,
	disableUser,
}