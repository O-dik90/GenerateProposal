require('dotenv').config();

const express = require('express');
const cors = require('cors');
const proposalRoutes = require('./routes/proposal-route');
const masterData = require('./routes/master-data');
const middlewareLogRequest = require('./middlewares/logs');
const helmet = require('helmet');

const app = express();

app.use(middlewareLogRequest);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to REST API Genpro' });
});

app.use('/api/v1', proposalRoutes);
app.use('/api/v1', masterData);

app.use((err, req, res) => {
  res.json({
    message: err.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
