const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../middlewares/validate.middleware');

// POST /auth/register — réservé à admin
router.post('/register', authenticate, authorize('admin'), validateRegister, authController.register);

// POST /auth/login — public (pas d'authentification requise)
router.post('/login', validateLogin, authController.login);

// GET /auth/me — route protégée (tous les rôles authentifiés)
router.get('/me', authenticate, authController.me);

module.exports = router;
