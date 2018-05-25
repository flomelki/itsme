const tokenCtrl = require('../controllers/tokenController')
const Router = require('koa-router');
const router = new Router();

router.put('/', tokenCtrl.createToken);
router.post('/', tokenCtrl.refreshToken);

module.exports = router.routes();