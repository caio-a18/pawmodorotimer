const { DataTypes } = require('sequelize');
const sequelize = require('/db');

const FocusTimes = sequelize.define('FocusTimes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false,    
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = FocusTimes;