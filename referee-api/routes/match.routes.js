const express = require('express');
const router = express.Router();
const matchController = require('../Controllers/match.controller');

router.post('/', matchController.createMatch);
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deletMatch);
router.get('/:id/arbitres', matchController.getMatchReferees);
module.exports = router;