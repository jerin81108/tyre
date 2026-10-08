const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAllAlerts);
router.put('/:id/read', alertController.markAsRead);
router.put('/:id/resolve', alertController.resolveAlert);

module.exports = router;
