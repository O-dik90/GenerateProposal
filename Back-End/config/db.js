require('dotenv').config();
const mysql = require('mysql2');

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Connection pool size
  timeout: 60000, // Connection timeout in milliseconds
});

module.exports = dbPool.promise();
