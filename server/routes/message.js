const msgCtrl = require('../controllers/messageController')
const Router = require('koa-router');
const router = new Router();

router.get('/:number/:from', msgCtrl.retrieveMsg);
router.put('/', msgCtrl.createMsg);

module.exports = router.routes();