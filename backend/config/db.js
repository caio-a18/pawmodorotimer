const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tomatopawsinitial', 'postgres', 'csds393tomatopaws', {
    host: 'tomatopaws.cnmmsigu82g0.us-east-2.rds.amazonaws.com',
    dialect: 'postgres',
    port: 5432
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