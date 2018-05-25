const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');
const md5 = require('md5');
const logger = require('../libs/logger.js');

/*
	creates a token for a given userid
	returns the created token
		*/
async function createToken(ctx) {
    logger.trace(ctx.params)
    logger.trace(`Creating token for userid ${ctx.params.userid}`);
    let promise = new Promise((resolve, reject) => {
        let userid = ctx.params.userid;
        let now = Date.now();
        let token = md5(now.toString());
        let end = now + 24 * 3600 * 1000;
        logger.trace(`insert into tokens (token, userid, enddate) values('${token}', '${userid}', '${end}')`)
        db.run(`insert into tokens (token, userid, enddate) values ('${token}', '${userid}', '${end}')`, (err) => {
            if (err) {
                logger.error(err);
                reject(err);
            }
            resolve(token);
        });
    });

    try {
        let res = await promise;
        ctx.ok({ token: res });
        return { token: res };
    }
    catch (e) {
        logger.error(e);
    }
}

/*
	refresh a given token for a given userid
	returns
		either 'ok' status
		either 'nok' status
		*/
async function refreshToken(ctx) {
    logger.trace(`Refresh token ${ctx.params.token} for userid ${ctx.params.userid}`);
    let promise = new Promise((resolve, reject) => {
        let now = Date.now();
        let end = now + 24 * 3600 * 1000;
        logger.trace(`update token set enddate = '${end}' where token = '${ctx.params.token}' and userid = '${ctx.params.userid}'`)
        db.run(`update token set enddate = '${end}' where token = '${ctx.params.token}' and userid = '${ctx.params.userid}'`, (err) => {
            if (err) reject(err);
            resolve();
        });
    });

    try {
        await promise;
    }
    catch (e) {
        logger.error(e);
    }
    ctx.ok()
}


module.exports = {
    createToken,
    refreshToken,
}