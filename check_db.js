const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

async function check() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("DESCRIBE Orders;");
        console.log(results);
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}
check();
