const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Rute Publik (Semua user yang sudah login bisa akses)
router.get('/', authenticate, applicationController.getAllActive);

// ==========================================================
// RUTE KHUSUS ADMIN (Dilindungi oleh authenticate & requireRole)
// ==========================================================
router.get('/all', authenticate, requireRole('admin'), applicationController.getAllForAdmin);
router.post('/', authenticate, requireRole('admin'), applicationController.createApp);
router.put('/:id', authenticate, requireRole('admin'), applicationController.updateApp);
router.delete('/:id', authenticate, requireRole('admin'), applicationController.deleteApp);

module.exports = router;