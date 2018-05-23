// example there : https://github.com/log4js-node/log4js-node/blob/master/examples/example.js
const log4js = require('log4js');

log4js.configure({
    appenders: {
        minimalist: { type: 'console' },
        prod: { type: 'file', filename: 'logs.log' }
    },
    categories: {
        default: { appenders: ['minimalist'], level: 'trace' },
        prod: { appenders: ['minimalist', 'prod'], level: 'warn' }
    }
});

module.exports = log4js.getLogger('default');