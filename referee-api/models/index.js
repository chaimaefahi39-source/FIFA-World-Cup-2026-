const sequelize = require('../config/database');
const Arbitre = require('./arbitre.model');
const Match = require('./match.model');
const Affectation = require('./affectation.model');

Arbitre.belongsToMany(Match, { through: Affectation });
Match.belongsToMany(Arbitre, {through: Affectation });

Affectation.belongsTo(Arbitre);
Affectation.belongsTo(Match);
Arbitre.hasMany(Affectation);
Match.hasMany(Affectation);

module.exports = {
    sequelize,
    Arbitre,
    Match,
    Affectation
};

