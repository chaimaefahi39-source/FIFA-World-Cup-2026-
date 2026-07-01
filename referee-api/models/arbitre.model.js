const  { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Arbitre = sequelize.define('Arbitre', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    nationalite: { type: DataTypes.STRING, allowNull: false },
    confederation: {
        type: DataTypes.ENUM('UEFA', 'CONMEBOLE', 'CAF', 'AFC', 'CONCACAF', 'OFC'),
        allowNull: false 
    },
    categorie: {
        type: DataTypes.ENUM('Central', 'Assistant', 'VAR', 'AVAR', '4e'),
        allowNull: false 
    },
    experience: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('actif', 'suspendu', 'blessé', 'retraité'),
        defaultValue: 'actif'
    }
}, {
    tableName: 'arbitres',
    timestamps: true


});

module.exports = Arbitre;