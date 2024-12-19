const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/settings', userController.updateUser);
router.get('/info', userController.getUserInfo);
router.put('/email', userController.updateEmail);
router.put('/password', userController.updatePassword);

module.exports = router;