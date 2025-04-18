const { Sequelize } = require('sequelize');
require('dotenv').config();
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'mysql',
  timezone: '+07:00',
  logging: process.env.DB_LOGGING === 'true'
});

module.exports = db;
