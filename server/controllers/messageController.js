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
	logger.trace(`Retrieving messages`);
	let promise = new Promise((resolve, reject) => {
		db.all(`select top ${ctx.params.number} from message where timestamp < '${ctx.params.timestamp}' order by timestamp desc;`, function (err, row) {
			if (err) {
				logger.error(err);
				reject(err);
			}

			if (row && row.length > 0) {
				logger.trace(`${row.length} messages retrieved`);
				resolve(
					{
						status: 'ok',
						messages : row,
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
			res = res.messages;
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
	logger.trace(`insert into messages (message, userid, timestamp) values( '${ctx.request.body.message}', '${ctx.request.body.userId}', '${ctx.request.body.timestamp}')`);
	try {
		db.run(`insert into messages (message, userid, timestamp) values( '${ctx.request.body.message}', '${ctx.request.body.userId}', '${ctx.request.body.timestamp}')`);
		ctx.ok();
	}
	catch (e)
	{
		logger.error(e);
		ctx.noContent();
	}
}

module.exports = {
	retrieveMsg,
	createMsg,
}