const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Import model definitions as functions
const userModel = require('./users');
const focusTimesModel = require('./focustimes');

// Initialize models
const User = userModel(sequelize, DataTypes);
const FocusTimes = focusTimesModel(sequelize, DataTypes);

// Define relationships
User.hasMany(FocusTimes, { foreignKey: 'user_id' });
FocusTimes.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    FocusTimes
};
