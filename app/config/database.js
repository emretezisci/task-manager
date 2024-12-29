require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,        // "hypenosc_task-management-app"
  process.env.DB_USER,        // "hypenosc_task"
  process.env.DB_PASSWORD,    // "your_a2_password"
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
