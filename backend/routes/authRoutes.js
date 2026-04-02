const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/verify', authenticate, authController.verifySession);

module.exports = router;