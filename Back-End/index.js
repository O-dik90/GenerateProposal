require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbConnection = require('./config/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cors());


app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to REST API Genpro" });
});
app.get("/master-data", async (req, res) => {
  try {
    const db = await dbConnection();
    const [rows] = await db.query('SELECT * FROM master_data');

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching data:", error); // Log the full error for debugging
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
});


app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
