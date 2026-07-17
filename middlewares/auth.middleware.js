const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

/**
 * Middleware d'authentification
 * Lit le header Authorization, extrait le token Bearer, le vérifie avec jwt.verify().
 * Si absent ou invalide → 401 Unauthorized.
 * Sinon, attache l'utilisateur décodé à req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant ou invalide.' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'utilisateur existe toujours en base
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé. Token invalide.' });
    }

    // Attacher l'utilisateur décodé à la requête
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré.' });
    }
    next(error);
  }
};

/**
 * Middleware d'autorisation (RBAC)
 * Middleware paramétrable qui reçoit la liste des rôles autorisés
 * et vérifie que req.user.role en fait partie.
 * Sinon → 403 Forbidden.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
