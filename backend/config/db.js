const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tomatopawsinitial', 'username', 'password', {
    host: 'http://tomatopaws.cnmmsigu82g0.us-east-2.rds.amazonaws.com/',
    dialect: 'postgres'
});

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