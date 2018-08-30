const adminCtrl = require('../controllers/admin_userController')
const Router = require('koa-router');
const router = new Router();

router.get('/', adminCtrl.getAllUsers);
router.get('/:username/:pwd', adminCtrl.logAdmin);
router.post('/enable', adminCtrl.enableUser);
router.post('/disable', adminCtrl.disableUser);

module.exports = router.routes();