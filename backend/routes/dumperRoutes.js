const express = require('express');
const router = express.Router();
const dumperController = require('../controllers/dumperController');

router.get('/', dumperController.getAllDumpers);
router.get('/:id', dumperController.getDumperById);
router.post('/', dumperController.createDumper);
router.put('/:id', dumperController.updateDumper);
router.delete('/:id', dumperController.deleteDumper);

module.exports = router;
