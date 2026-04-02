const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', authenticate, applicationController.getAllActive);

router.get('/all', authenticate, requireRole('admin'), applicationController.getAllForAdmin);
router.post('/', authenticate, requireRole('admin'), applicationController.createApp);
router.post('/:id/update', authenticate, requireRole('admin'), applicationController.updateApp);
router.post('/:id/delete', authenticate, requireRole('admin'), applicationController.deleteApp);

module.exports = router;