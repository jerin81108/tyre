const express = require('express');
const router = express.Router();
const tyreController = require('../controllers/tyreController');

router.get('/', tyreController.getAllTyres);
router.get('/:id', tyreController.getTyreById);
router.post('/', tyreController.createTyre);
router.put('/:id', tyreController.updateTyre);
router.put('/:id/pressure', tyreController.updatePressure);

module.exports = router;
