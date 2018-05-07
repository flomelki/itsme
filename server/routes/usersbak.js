const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');

const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');

const Router = require('koa-router');
const router = new Router();
const PORT = 8067;

app.use(cors());	// << deprecated. Find better method ?

/*
	retrieves username & password details
	returns
		either a token with 24 hours validity + the user's color + 'ok' status
		either 'nok' status
		*/
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

/*
	checks that a given username is free
	returns
		either 'ok' status
		either 'nok' status
		*/
		router.get('/checkusername/:username', async (ctx, next) => {
			next();
		});

		app.use(async ctx =>
		{
			let promise = new Promise((resolve, reject) =>
			{
				return checkusername(ctx.params.username);
			})

			if (await promise)
				ctx.body =	{	status : 'ok'	};
			else 
				ctx.body = {	status : 'nok'	};
		});

		async function checkUsername(username)
		{
			db.all(`select * from users where username = '${ctx.params.username}';`, function(err, row)
			{
				if (err)
				{
					console.dir(err)
					throw (err);
				}

				if (!row || row.length === 0)
					return true;
				else 
					return false;
			});
		}

/*
	records a username + password
	generates a random color for this user
	returns
		TODO
		*/
		router.post('/:username/:pwd', async (ctx, next) => {
			next();
		});

		app.use(async ctx =>
		{
			let promise = new Promise((resolve, reject) =>
			{
				return checkusername(ctx.params.username);
			})

			if (await promise)
			{
				let randomColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
				db.run(`insert into users values(null, '${ctx.params.username}', '${ctx.params.pwd}', '${randomColor}')`);
			}
			else	{}
		});


		app.use(router.routes());

		const server = app.listen(PORT, () => {
			console.log(`Server listening on port: ${PORT}`);
		});

		module.exports = server;