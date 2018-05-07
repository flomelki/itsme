const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');

const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');

const Router = require('koa-router');
const router = new Router();
const PORT = 8067;

app.use(cors());	// << deprecated. Find better method ?


router.get('/:username/:pwd', async (ctx, next) => {
	await next();
});

app.use(async ctx => 
{
	console.log('oqsfd')
	let promise = new Promise((resolve, reject) => {
		db.all(`select * from users where username = '{$ctx.params.username}' and password = '{$ctx.params.pwd}';`, function(err, row)
		{
			if (row && row.length === 1)
			{
				let now = Date.now();
				let token = btoa(now.toString());
				let end = now + 24*3600*1000;
				db.run(`insert into tokens values(${token}, ${end}`);
				resolve(
				{
					status : 'ok',
					token : token
				});
			}
			else 
				resolve({	status : 'nok'	});
		});	
	});
	ctx.body = await promise;
	console.log(ctx.body)
})

app.use(router.routes());

const server = app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;