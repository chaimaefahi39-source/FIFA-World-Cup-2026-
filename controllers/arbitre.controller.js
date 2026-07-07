const { Arbitre, Match, Affectation } = require('../models/index');

exports.createArbitre = async (req, res, next) => {
  try {
    const arbitre = await Arbitre.create(req.body);
    res.status(201).json(arbitre);
  } catch (error) {
    next(error);
  }
};
exports.getAllArbitres = async (req, res, next) => {
  try {
    const arbitres = await Arbitre.findAll();
    res.status(200).json(arbitres);
  } catch (error) {
    next(error);
  }
};
exports.getArbitreById = async (req, res, next) => {
  try {
    const arbitre = await Arbitre.findByPk(req.params.id);
    if (!arbitre) return res.status(404).json({ message: 'Referee not found' });
    res.status(200).json(arbitre);
  } catch (error) {
    next(error);
  }
};
exports.updateArbitre = async (req, res, next) => {
  try {
    const arbitre = await Arbitre.findByPk(req.params.id);
    if (!arbitre) return res.status(404).json({ message: 'Referee not found' });
    await arbitre.update(req.body);
    res.status(200).json(arbitre);
  } catch (error) {
    next(error);
  }
};
exports.deleteArbitre = async (req, res, next) => {
  try {
    const arbitre = await Arbitre.findByPk(req.params.id);
    if (!arbitre) return res.status(404).json({ message: 'Referee not found' });
    await arbitre.destroy();
    res.status(200).json({ message: 'Referee deleted successfully' });
  } catch (error) {
    next(error);
  }
};
exports.getArbitreMatches = async (req, res, next) => {
  try {
    const arbitre = await Arbitre.findByPk(req.params.id, {
      include: {
        model: Match,
        attributes: ['id', 'equipeDomicile', 'equipeExterieur', 'stade', 'dateMatch', 'phase'],
        through: { attributes: ['role'] }
      }
    });
    if (!arbitre) return res.status(404).json({ message: 'Referee not found' });
    res.status(200).json(arbitre);
  } catch (error) {
    next(error);
  }
};