require('dotenv').config();

const express = require('express');
const cors = require('cors');
const proposalRoutes = require('./routes/proposal-route');
const middlewareLogRequest = require('./middlewares/logs');

const app = express();

app.use(middlewareLogRequest);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to REST API Genpro' });
});

app.use('/api/v1', proposalRoutes);

app.use((err, req, res) => {
  res.json({
    message: err.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
