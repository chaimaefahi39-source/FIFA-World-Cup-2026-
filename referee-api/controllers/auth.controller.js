const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

/**
 * POST /auth/register
 * Créer un utilisateur (mot de passe haché) — réservé à admin
 */
exports.register = async (req, res, next) => {
  try {
    const { nom, email, password, role } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Créer l'utilisateur (le hook beforeCreate hache le mot de passe)
    const user = await User.create({ nom, email, password, role });

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      user // Le mot de passe est exclu grâce à toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/login
 * Se connecter, renvoie un token JWT
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation des entrées
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    // Chercher l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe avec bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Générer un JWT contenant l'id et le role de l'utilisateur
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user // Le mot de passe est exclu grâce à toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /auth/me
 * Renvoie le profil de l'utilisateur connecté (route protégée)
 */
exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
