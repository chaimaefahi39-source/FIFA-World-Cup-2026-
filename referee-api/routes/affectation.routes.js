const express = require('express');
const router = express.Router();
const affectationController = require('../controllers/affectation.controller');
const { validateAffectation } = require('../middlewares/validate.middleware');

router.post('/', validateAffectation, affectationController.createAffectation);
router.post('/', affectationController.createAffectation);
module.exports = router;