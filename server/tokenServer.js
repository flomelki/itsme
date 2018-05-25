const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');
const PORT = 8068;

const Router = require('koa-router');
const router = new Router();
const Logger = require('koa-logger');
const respond = require('koa-respond');
const BodyParser = require('koa-bodyparser');
const log4jslogger = require('./libs/logger.js');

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
app.use(Logger());
router.use('/tokens', require('./routes/tokens'));
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(PORT, () => {
    log4jslogger.warn(`${new Date()} : Token server listening on port: ${PORT}`);
});

module.exports = app;