const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Semua rute user murni KHUSUS ADMIN
router.use(authenticate, requireRole('admin'));

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id/role', userController.updateUserRole);
router.put('/:id/reset-password', userController.resetPassword);
router.delete('/:id', userController.deleteUser);

module.exports = router;