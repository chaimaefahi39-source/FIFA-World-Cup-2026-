const express = require('express');
const router = express.Router();
const arbitreController = require('../controllers/arbitre.controller');
const { validateArbitre } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// GET /arbitres — tous les rôles authentifiés
router.get('/', authenticate, authorize('admin', 'commissaire', 'arbitre', 'consultation'), arbitreController.getAllArbitres);

// GET /arbitres/:id — tous les rôles authentifiés
router.get('/:id', authenticate, authorize('admin', 'commissaire', 'arbitre', 'consultation'), arbitreController.getArbitreById);

// POST /arbitres — admin et commissaire uniquement
router.post('/', authenticate, authorize('admin', 'commissaire'), validateArbitre, arbitreController.createArbitre);

// PUT /arbitres/:id — admin et commissaire uniquement
router.put('/:id', authenticate, authorize('admin', 'commissaire'), arbitreController.updateArbitre);

// DELETE /arbitres/:id — admin uniquement
router.delete('/:id', authenticate, authorize('admin'), arbitreController.deleteArbitre);

// GET /arbitres/:id/matchs — tous les rôles authentifiés
router.get('/:id/matchs', authenticate, authorize('admin', 'commissaire', 'arbitre', 'consultation'), arbitreController.getArbitreMatches);

module.exports = router;