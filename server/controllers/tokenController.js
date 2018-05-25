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

    let res;
    try {
        res = await promise;

    }
    catch (e) {
        logger.error(e);
    }

    ctx.ok({ token: res });
    return { token: res };
}

/*
	refresh a given token for a given userid only if this token is still alive
	returns
		either 'ok' status
		either 'nok' status
		*/
async function refreshToken(ctx) {
    logger.trace(`Refresh token ${ctx.request.body.token} for userid ${ctx.request.body.userid}`);
    let promise = new Promise((resolve, reject) => {
        db.all(`select * from tokens where token = '${ctx.request.body.token}' and userid = '${ctx.request.body.userid}';`, function (err, row) {
            if (err) {
				logger.error(err);
				reject(err);
			}

            logger.debug(row)
            if (row && row.length === 1)
            {
                let now = Date.now();
                let end = now + 24 * 3600 * 1000;
                
                logger.debug(`now : ${now}`)
                logger.debug(`current token end date : ${row[0].enddate}`)
                logger.debug(`next token end date : ${end}`)
                
                if (row[0].enddate > now)
                {
                    logger.trace(`update tokens set enddate = '${end}' where token = '${ctx.request.body.token}' and userid = '${ctx.request.body.userid}'`)
                    db.run(`update tokens set enddate = '${end}' where token = '${ctx.request.body.token}' and userid = '${ctx.request.body.userid}'`, (err) => {
                        if (err) reject(err);
                        resolve('ok');
                    });
                }
                else    resolve('nok');
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

    logger.debug(status)
    
    if (status === 'ok')    ctx.ok();
    else ctx.noContent();
}


module.exports = {
    createToken,
    refreshToken,
}