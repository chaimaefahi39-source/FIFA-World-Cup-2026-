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