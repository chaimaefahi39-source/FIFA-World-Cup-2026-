const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const { validateMatch } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// GET /matchs — tous les rôles authentifiés
router.get('/', authenticate, authorize('admin', 'commissaire', 'arbitre', 'consultation'), matchController.getAllMatches);

// GET /matchs/:id — tous les rôles authentifiés
router.get('/:id', authenticate, authorize('admin', 'commissaire', 'arbitre', 'consultation'), matchController.getMatchById);

// POST /matchs — admin et commissaire uniquement
router.post('/', authenticate, authorize('admin', 'commissaire'), validateMatch, matchController.createMatch);

// PUT /matchs/:id — admin et commissaire uniquement
router.put('/:id', authenticate, authorize('admin', 'commissaire'), matchController.updateMatch);

// DELETE /matchs/:id — admin uniquement
router.delete('/:id', authenticate, authorize('admin'), matchController.deleteMatch);

// GET /matchs/:id/arbitres — tous les rôles authentifiés
router.get('/:id/arbitres', authenticate, authorize('admin', 'commissaire', 'arbitre', 'consultation'), matchController.getMatchReferees);

module.exports = router;
