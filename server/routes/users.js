const userCtrl = require('../controllers/userController')
const Router = require('koa-router');
const router = new Router();

router.get('/:username/:pwd', userCtrl.logUser);
router.get('/checkuser/:username', userCtrl.checkUser);
router.put('/', userCtrl.createUser);

module.exports = router.routes();