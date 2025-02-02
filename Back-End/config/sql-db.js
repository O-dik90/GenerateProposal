const { Sequelize } = require('sequelize');

const DBSQL = new Sequelize('auth_db', 'user', 'password_user90', {
  host: 'localhost',
  dialect: 'mysql',
});
