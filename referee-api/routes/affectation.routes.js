const express = require('express');
const router = express.Router();
const affectationController = require('../controlllers/affectation.controller');

router.post('/', affectationController.createAffectation);

module.exports = router;