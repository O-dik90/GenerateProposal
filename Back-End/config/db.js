require('dotenv').config();
const mysql = require('mysql2/promise');

let connection;
const dbConnection = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password_user90',
        database: 'proposalDB',
      });
      return connection;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = dbConnection;