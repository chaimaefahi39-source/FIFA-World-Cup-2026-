const { Affectation, Arbitre, Match } = require('../models/index');

exports.createAffectation = async (req, res, next) => {
  try {
    const { arbitreId, matchId, role } = req.body;

    const arbitre = await Arbitre.findByPk(arbitreId);
    const match = await Match.findByPk(matchId);

    if (!arbitre || !match) {
      return res.status(404).json({ message: 'Referee or Match not found' });
    }
    const affectation = await Affectation.create({
      ArbitreId: arbitreId,
      MatchId: matchId,
      role
    });

    res.status(201).json(affectation);
  } catch (error) {
    next(error);
  }
};

exports.deleteAffectation = async (req, res, next) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id);
    if (!affectation) {
      return res.status(404).json({ message: 'Affectation not found' });
    }
    await affectation.destroy();
    res.status(200).json({ message: 'Affectation deleted successfully' });
  } catch (error) {
    next(error);
  }
};