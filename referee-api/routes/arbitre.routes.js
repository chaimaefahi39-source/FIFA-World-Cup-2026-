const express = require('express');
const router = express.Router();
const arbitreController = require('../controllers/arbitre.controller');

router.post('/', arbitreController.createArbitre);
router.get('/', arbitreController.getAllArbitres);
router.get('/:id', arbitreController.getArbitreById);
router.put('/:id', arbitreController.updateArbitre);
router.delete('/:id', arbitreController.deleteArbitre);
router.get('/:id/matchs', arbitreController.getArbitreMatches);

module.exports = router;