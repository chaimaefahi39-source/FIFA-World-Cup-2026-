const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { validateMatch } = require('../middlewares/validate.middleware');

router.post('/', validateMatch, matchController.createMatch);
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);
router.get('/:id/arbitres', matchController.getMatchReferees);

module.exports = router;






















