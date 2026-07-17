exports.validateArbitre = (req, res, next) => {
  const { nom, prenom, nationalite, confederation, categorie } = req.body;

  if (!nom || !prenom || !nationalite || !confederation || !categorie) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const allowedConf = ['UEFA', 'CONMEBOL', 'CAF', 'AFC', 'CONCACAF', 'OFC'];
  const allowedCat = ['Central', 'Assistant', 'VAR', 'AVAR', '4e'];

  if (!allowedConf.includes(confederation) || !allowedCat.includes(categorie)) {
    return res.status(400).json({ message: 'Invalid confederation or category value' });
  }

  next();
};

exports.validateMatch = (req, res, next) => {
  const { equipeDomicile, equipeExterieur, stade, villeHote, dateMatch, phase } = req.body;

  if (!equipeDomicile || !equipeExterieur || !stade || !villeHote || !dateMatch || !phase) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const allowedPhases = ['Groupes', '8e', '4e', 'demi', 'finale'];
  if (!allowedPhases.includes(phase)) {
    return res.status(400).json({ message: 'Invalid match phase value' });
  }

  next();
};

exports.validateAffectation = (req, res, next) => {
  const { arbitreId, matchId, role } = req.body;

  if (!arbitreId || !matchId || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const allowedRoles = ['central', 'assistant', 'VAR', 'AVAR', '4e'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role value' });
  }

  next();
};

exports.validateRegister = (req, res, next) => {
  const { nom, email, password, role } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({ message: 'Nom, email et mot de passe sont requis.' });
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format d\'email invalide.' });
  }

  // Validation du mot de passe (minimum 6 caractères)
  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
  }

  // Validation du rôle si fourni
  if (role) {
    const allowedRoles = ['admin', 'commissaire', 'arbitre', 'consultation'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Rôles autorisés : admin, commissaire, arbitre, consultation.' });
    }
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format d\'email invalide.' });
  }

  next();
};