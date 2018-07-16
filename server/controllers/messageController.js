const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');
const logger = require('../libs/logger.js');

/*
	retrieves a given number of messages
	returns
		either asked number of messages (+ 'ok' status)
		either 'nok' status
		*/
async function retrieveMsg(ctx) {
	let query = +ctx.params.fromdt > 0
		? `select * from messages where timestamp < ${ctx.params.fromdt} order by timestamp desc limit ${ctx.params.number};`
		: `select * from messages order by timestamp desc limit ${ctx.params.number};`;
	
	logger.trace(query);

	let promise = new Promise((resolve, reject) => {
		db.all(query, function (err, row) {
			if (err) {
				logger.error(err);
				reject(err);
			}

			if (row && row.length > 0) {
				logger.trace(`${row.length} messages retrieved`);
				resolve(
					{
						status: 'ok',
						messages: row,
					});
			}
			else {
				resolve({ status: 'nok' });
			}
		});
	});

	let res;
	try {
		msgState = await promise;
		if (msgState.status === 'ok') {
			res = msgState.messages;
		}
	}
	catch (e) {
		logger.error(e);
	}

	if (res !== undefined)
		ctx.ok(res);
	else
		ctx.noContent();
}

/*
	records a message
	returns
		status
		*/
async function createMsg(ctx) {
	let query = `insert into messages (message, userid, timestamp) values( '${ctx.request.body.message}', '${ctx.request.body.userId}', '${ctx.request.body.timestamp}')`;
	logger.trace(query);
	try {
		db.run(query);
		ctx.ok();
	}
	catch (e) {
		logger.error(e);
		ctx.noContent();
	}
}

module.exports = {
	retrieveMsg,
	createMsg,
}