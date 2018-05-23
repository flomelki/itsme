const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');
const md5 = require('md5');

/*
	retrieves username & password details
	returns
		either a token with 24 hours validity + the user's color + 'ok' status
		either 'nok' status
		*/
		async function logUser(ctx)
		{
			let promise = new Promise((resolve, reject) => {
				db.all(`select * from users where username = '${ctx.params.username}' and password = '${ctx.params.pwd}';`, function(err, row)
				{
					console.log(row)
					if (row && row.length === 1)
					{
						console.log('ok')
						let user = row[0];
						let now = Date.now();
						let token = md5(now.toString());
						let end = now + 24*3600*1000;
						console.log(`insert into tokens values('${token}', '${user.userid}', '${end}')`)
						db.run(`insert into tokens values('${token}', '${user.userid}', '${end}')`);
						resolve(
						{
							status : 'ok',
							userid : user.userid,
							token : token,
							color : user.color,
						});
					}
					else 
						resolve({	status : 'nok'	});
				});	
			});
			let res = await promise;
			if (res.status === 'ok')	ctx.ok({ userid : res.userid, token : res.token, color : res.color });
			else	ctx.noContent();
		}

/*
	checks that a given username is free
	returns
		either 'ok' status
		either 'nok' status
		*/
		async function checkUser(ctx)
		{
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
		async function createUser(ctx)
		{
			if (await getUsername(ctx.request.body.username))
			{
				let randomColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
				db.run(`insert into users values(null, '${ctx.request.body.username}', '${ctx.request.body.pwd}', '${randomColor}')`);
				ctx.ok();
			}
			else	{
				ctx.noContent();
			}
		}

		function getUsername(username)
		{
			let promise = new Promise((resolve, reject) =>
			{
				db.all(`select * from users where username = '${username}';`, function(err, row)
				{
					if (err)
					{
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