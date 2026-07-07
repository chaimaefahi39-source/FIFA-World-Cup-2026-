const { Match, Arbitre } = require('../models/index');

exports.createMatch = async (req, res, next) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (error) {
    next(error);
  }
};
exports.getAllMatches = async (req, res, next) => {
  try {
    const matchs = await Match.findAll();
    res.status(200).json(matchs);
  } catch (error) {
    next(error);
  }
};
exports.getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
};
exports.updateMatch = async (req, res, next) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    await match.update(req.body);
    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
};
exports.deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    await match.destroy();
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    next(error);
  }
};
exports.getMatchReferees = async (req, res, next) => {
  try {
    const match = await Match.findByPk(req.params.id, {
      include: {
        model: Arbitre,
        attributes: ['id', 'nom', 'prenom', 'nationalite', 'categorie'],
        through: { attributes: ['role'] }
      }
    });
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
};