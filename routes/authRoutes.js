const authController = require('../controllers/authController');
const router = require('express').Router();

router.post('/admin-login',authController.validate('adminLogin'),authController.adminLogin);

module.exports = router;