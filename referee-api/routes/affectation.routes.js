const express = require('express');
const router = express.Router();
const affectationController = require('../controllers/affectation.controller');
const { validateAffectation } = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// POST /affectations — admin et commissaire uniquement
router.post('/', authenticate, authorize('admin', 'commissaire'), validateAffectation, affectationController.createAffectation);

// DELETE /affectations/:id — admin et commissaire uniquement
router.delete('/:id', authenticate, authorize('admin', 'commissaire'), affectationController.deleteAffectation);

module.exports = router;