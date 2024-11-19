require('dotenv').config();
const mysql = require('mysql2/promise');

let connection;
const dbConnection = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      return connection;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = dbConnection;