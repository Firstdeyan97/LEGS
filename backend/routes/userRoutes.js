const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.use(authenticate, requireRole('admin'));

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/:id/update', userController.updateUserRole);
router.post('/:id/reset-password', userController.resetPassword);
router.post('/:id/delete', userController.deleteUser);

module.exports = router;