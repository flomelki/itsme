const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('itsme.db');

const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');

const Router = require('koa-router');
const router = new Router();
const PORT = 8068;

router.post('/:username/:pwd', async (ctx) => {
	let randomColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
	console.log(randomColor)
	db.run(`insert into users values(null, '${ctx.params.username}', '${ctx.params.pwd}', '${randomColor.toString()}')`);
});

app.use(cors());	// << deprecated. Find better method ?
app.use(router.routes());

const server = app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;