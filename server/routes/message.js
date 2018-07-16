const msgCtrl = require('../controllers/messageController')
const Router = require('koa-router');
const router = new Router();

router.get('/:number/:fromdt', msgCtrl.retrieveMsg);
router.put('/', msgCtrl.createMsg);

module.exports = router.routes();