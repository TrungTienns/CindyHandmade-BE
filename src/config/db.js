const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        },
        logging: false
    }
);

const connectDB = async (retries = 10, delayMs = 15000) => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database Connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        if (retries > 0) {
            console.log(`Retrying database connection in ${delayMs / 1000}s... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1, delayMs), delayMs);
        } else {
            console.error('Exhausted all retries connecting to the database. The server will keep running without a DB connection; restart the service after fixing the issue.');
        }
    }
};

module.exports = { sequelize, connectDB };