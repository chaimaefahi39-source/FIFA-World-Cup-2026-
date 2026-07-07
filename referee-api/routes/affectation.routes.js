const express = require('express');
const router = express.Router();
const affectationController = require('../controllers/affectation.controller');

router.post('/', affectationController.createAffectation);
module.exports = router;