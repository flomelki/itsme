const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');

const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');

const Router = require('koa-router');
const router = new Router();
const PORT = 8069;

router.get('/:username', async (ctx) => {
	db.serialize(function()
	{
		db.all(`select * from users where username = '${ctx.params.username}';`, function(err, row)
		{
			if (err)
			{
				console.dir(err)
				throw (err);
			}

			if (!row || row.length === 0)
			{
				ctx.body =
				{
					status : 'ok',
				};
			}
			else 
				ctx.body = {	status : 'nok'	};
		});
	});
});


app.use(cors());	// << deprecated. Find better method ?
app.use(router.routes());

const server = app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;