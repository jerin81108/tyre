const express = require('express');
const router = express.Router();
const damageController = require('../controllers/damageController');

router.post('/', damageController.createDamageReport);
router.get('/', damageController.getAllDamageReports);

module.exports = router;
