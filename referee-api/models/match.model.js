const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define('Match', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  equipeDomicile: { type: DataTypes.STRING, allowNull: false },
  equipeExterieur: { type: DataTypes.STRING, allowNull: false },
  stade: { type: DataTypes.STRING, allowNull: false },
  villeHote: { type: DataTypes.STRING, allowNull: false },
  dateMatch: { type: DataTypes.DATE, allowNull: false },
  phase: {
    type: DataTypes.ENUM('Groupes', '8e', '4e', 'demi', 'finale'),
    allowNull: false
  }
}, {
  tableName: 'matchs',
  timestamps: true,
  indexes: [
    { fields: ['dateMatch'] } 
  ]
});

module.exports = Match;