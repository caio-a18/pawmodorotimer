const { Sequelize } = require('sequelize');
const User = require('./models/users');
const FocusTimes = require('./models/focustimes');

const sequelize = new Sequelize('tomatopawsinitial', 'username', 'password', {
    host: 'http://tomatopaws.cnmmsigu82g0.us-east-2.rds.amazonaws.com/',
    dialect: 'postgres'
});

// Define the relationship
User.hasMany(FocusTimes, { foreignKey: 'userID' });
FocusTimes.belongsTo(User, { foreignKey: 'userId '});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = sequelize;