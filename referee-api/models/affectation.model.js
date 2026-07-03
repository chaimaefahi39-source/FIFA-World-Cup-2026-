const { DataTypes } = require('sequelize');
const sequelize = require('../config/databese');

const Affectation = sequelize.define('Affectation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: {
        type: DataTypes.ENUM('central', 'assistant', 'VAR', 'AVAR', '4e'),
        allowNull: false
    
    }
}, {
    tableName: 'affectations',
    timestamps: true,
    indexes: [
        {
            unique: true, 
            fields: ['ArbitreId', 'MatchId', 'role']

        }
    ]

});

module.exports = Affectation;