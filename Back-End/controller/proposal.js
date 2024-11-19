const dbConnection = require('../config/db');

const getMasterData = async (req, res) => {
  try {
    const db = await dbConnection();
    const [rows] = await db.query('SELECT * FROM master_data');

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
}

module.exports = {
  getMasterData,
};