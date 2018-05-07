const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');
const PORT = 8067;

const Router = require('koa-router');
const router = new Router();
const Logger = require('koa-logger');
const respond = require('koa-respond');
const BodyParser = require('koa-bodyparser');

app.use(cors());	// << deprecated. Find better method ?
app.use(BodyParser({
  enableTypes: ['json'],
  jsonLimit: '5mb',
  strict: true,
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422)
  }
}))

app.use(respond());

// API routes
require('./routes')(router);

app.use(Logger());
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;